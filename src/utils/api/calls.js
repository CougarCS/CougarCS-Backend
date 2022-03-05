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
	COUGARCS_CLOUD_URL,
	COUGARCS_CLOUD_ACCESS_KEY,
	COUGARCS_CLOUD_SECRET_KEY,

	CCSCLOUD_TOKEN_CACHE_TIME,
	YOUTUBE_PLAYLIST_ID,
	YOUTUBE_API_KEY,
} from '../config';
import { logger } from '../logger/logger';
import { getCache, setCache } from '../caching/cacheData';
import { getMembershipDates } from '../membershipDate';


const key = 'token';
const stripe = new Stripe(STRIPE_API_KEY);

const renameKey = (obj, oldKey, newKey) => {
	if (oldKey !== newKey && !obj.date) {
		Object.defineProperty(
			obj,
			newKey,
			Object.getOwnPropertyDescriptor(obj, oldKey)
		);
		delete obj[oldKey];
	}
};

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

async function getAccessToken() {
	const cacheContent = getCache(key);
	if (cacheContent) {

		logger.info('Fetched Access Token from Cache');
		return cacheContent.token;
	}

	const URL = `${COUGARCS_CLOUD_URL}/login`;
	const data = {
		accessKeyID: COUGARCS_CLOUD_ACCESS_KEY,
		secretAccessKey: COUGARCS_CLOUD_SECRET_KEY,
	};
	logger.info('Fetching access token...');
	const res = await axios.post(URL, data);

	logger.info('Stored Access Token in Cache');
	setCache(key, { token: res.data.token }, CCSCLOUD_TOKEN_CACHE_TIME); // We need to reduce the cache time to 5 minutes (access token expires in 5)


	return res.data.token;
}

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
	const { membershipStart, membershipEnd } = getMembershipDates(paidUntil);

	const token = await getAccessToken();
	const URL = `${COUGARCS_CLOUD_URL}/contact`;

	const data = {
		transaction,
		psid: uhID,
		email,
		firstName,
		lastName,
		phoneNumber: phone,
		shirtSize,

		membershipStart,
		membershipEnd,
	};
	const headers = { Authorization: `Bearer ${token}` };
	logger.info(`POST to CougarCS Cloud API for UHID=${uhID}`);
	const res = await axios.post(URL, data, { headers });

	return res.data;
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
