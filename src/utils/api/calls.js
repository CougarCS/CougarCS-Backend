import sgMail from '@sendgrid/mail';
import axios from 'axios';
import Stripe from 'stripe';
import moment from 'moment';
import _ from 'lodash';
import { Client } from '@notionhq/client';
import {
	CALENDAR_API_KEY,
	CALENDAR_ID,
	RECAPTCHA_SECRET_KEY,
	SENDGRID_API_KEY,
	STRIPE_API_KEY,
	NOTION_TOKEN,
	NOTION_TUTOR_DB,
	YOUTUBE_PLAYLIST_ID,
	YOUTUBE_API_KEY,
} from '../config';
import { logger } from '../logger/logger';
import { renameKey } from './utils/utils';
import { supabase } from '../supabase';

const stripe = new Stripe(STRIPE_API_KEY);

exports.sendEmail = async function sendEmail(toEmail, email, subject, content) {
	sgMail.setApiKey(SENDGRID_API_KEY);
	const msg = {
		to: toEmail,
		from: email,
		subject,
		text: content,
	};

	await sgMail.send(msg);
	logger.info(
		`Service: Contact Form - Email has been sent. From: ${email.email}`
	);
};

exports.getEvents = async function getEvents() {
	const { data } = await axios.get(
		`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_API_KEY}`
	);

	let events = [];
	data.items
		.filter((obj) => obj?.start?.date || obj?.start?.dateTime)
		.forEach((obj) => {
			renameKey(obj.start, 'dateTime', 'date');
			renameKey(obj.end, 'dateTime', 'date');
			events.push({
				start: obj.start.date,
				end: obj.end.date,
				title: obj.summary,
				desc: obj?.description ? obj.description : 'TBD',
			});
		});

	events = _.sortBy(events, (o) => moment(o.start));
	return { events };
};

exports.checkRecaptcha = async function checkRecaptcha(recaptchaToken) {
	const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
	return axios.post(verificationUrl);
};

exports.createStripeCustomer = async function createStripeCustomer(
	firstName,
	lastName,
	email,
	uhID,
	paidUntil,
	phone,
	amount,
	token,
	idempotencyKey
) {
	await stripe.customers
		.create({
			email,
			phone,
			name: `${firstName} ${lastName}`,
			metadata: {
				'UH ID': uhID,
				'Paid For': paidUntil,
			},
		})
		.catch((err) => {
			throw new Error(err);
		})
		.then(async (customer) => {
			await stripe.paymentIntents
				.create(
					{
						amount,
						currency: 'USD',
						description: 'Membership Payment',
						payment_method: token,
						customer: customer.id,
						confirm: true,
						receipt_email: email,
					},
					{ idempotencyKey }
				)
				.catch((err) => {
					throw new Error(err);
				});
		});
	logger.info({
		service: 'payment',
		msg: 'Payment create',
		meta: { payee: uhID },
	});
};

exports.getTutors = async function getTutors() {
	const notion = new Client({
		auth: NOTION_TOKEN,
	});

	const payload = {
		path: `databases/${NOTION_TUTOR_DB}/query`,
		method: 'POST',
		body: {
			sorts: [
				{
					property: 'Name',
					direction: 'ascending',
				},
			],
		},
	};

	const data = await notion.request(payload);

	const tutors = data.results
		.filter((obj) => obj?.properties?.Name?.title[0]?.text.content)
		.map((obj) => {
			return {
				name: obj.properties.Name.title[0].text.content,
				linkedin: obj.properties?.LinkedIn?.url,
			};
		});

	return { tutors };
};

exports.postContact = async function postContact({
	transaction,
	uhID,
	email,
	firstName,
	lastName,
	phone,
	shirtSize,
	paidUntil,
}) {
	let contactResponse = await supabase.from('contacts').upsert({
		uh_id: uhID,
		email,
		first_name: firstName,
		last_name: lastName,
		phone_number: phone,
		shirt_size_id: shirtSize,
	});

	const isDuplicateContact = contactResponse.error?.code === '23505';
	const isDuplicateUHID =
		isDuplicateContact &&
		contactResponse.error?.message?.includes('contacts_uh_id_key');
	const isDuplicateEmail =
		isDuplicateContact &&
		contactResponse.error?.message?.includes('contacts_email_key');

	if (isDuplicateUHID) {
		contactResponse = await supabase
			.from('contacts')
			.update({
				email,
				first_name: firstName,
				last_name: lastName,
				phone_number: phone,
				shirt_size_id: shirtSize,
			})
			.eq('uh_id', uhID);
	} else if (isDuplicateEmail) {
		contactResponse = await supabase
			.from('contacts')
			.update({
				uh_id: uhID,
				first_name: firstName,
				last_name: lastName,
				phone_number: phone,
				shirt_size_id: shirtSize,
			})
			.eq('email', email);
	}

	if (contactResponse.error) {
		logger.error(contactResponse.error);
		return;
	}

	const contactData = await supabase
		.from('contacts')
		.select('contact_id')
		.eq('email', email);

	if (contactData.error) {
		logger.error(contactData.error);
		return;
	}

	const today = new Date();
	const springStart = today.getMonth() < 6;
	const paidForSemester = paidUntil === 'semester';

	const endYear =
		today.getFullYear() + (paidForSemester && springStart ? 0 : 1);
	const endMonth = springStart !== paidForSemester ? '-1' : '-7';
	const endDate = `${endYear}${endMonth}-1 06:00:00`;

	const membershipResponse = await supabase.from('membership').insert({
		contact_id: contactData.data[0].contact_id,
		start_date: today.toISOString(),
		end_date: endDate,
		membership_code_id: transaction.includes('Stripe') ? 'mc-ps' : 'mc-p',
	});

	if (membershipResponse.error) {
		logger.error(membershipResponse.error);
		return;
	}
	logger.info(`POST to CougarCS Cloud API for UHID=${uhID}`);
};

exports.getYoutubeVideos = async function getYoutubeVideos() {
	const { data } = await axios.get(
		`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
	);
	const videos = [];
	data.items.forEach((obj) => {
		videos.push({
			videoId: obj.snippet.resourceId.videoId,
			title: obj.snippet.title,
			description: obj.snippet.description,
			thumbnail: obj.snippet.thumbnails.standard.url,
		});
	});

	return { videos };
};
