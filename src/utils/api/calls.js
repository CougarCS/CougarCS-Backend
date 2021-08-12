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
	CACHE_TIME,
} from '../config';
import { logger } from '../logger';
import { getCache, setCache } from '../cacheData';

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

exports.createStripeCustomer = function createStripeCustomer(
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
	stripe.customers
		.create({
			email,
			phone,
			name: `${firstName} ${lastName}`,
			metadata: {
				'UH ID': uhID,
				'Paid For': paidUntil,
			},
		})
		.then((customer) => {
			stripe.paymentIntents.create(
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
			);
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
		logger.info('Fetched Access token from cache');
		return cacheContent.token;
	}
	const url = `${COUGARCS_CLOUD_URL}/login`;
	const data = { COUGARCS_CLOUD_ACCESS_KEY, COUGARCS_CLOUD_SECRET_KEY };
	logger.info('Fetching access token.');
	const res = await axios.post(url, data);
	logger.info('Stored token in cache');
	setCache(key, { token: res.data.token }, CACHE_TIME);
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
}) {
	const token = getAccessToken();

	const data = {
		transaction,
		psid: uhID,
		email,
		firstName,
		lastName,
		phoneNumber: phone,
		shirtSize,
		membershipStart,
		paidUntil,
	};

	logger.info(`POST to CougarCloud Api: api for: ${uhID}`);
	const res = await axios.post(`${COUGARCS_CLOUD_URL}/contact`, data, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return res.data;
};
