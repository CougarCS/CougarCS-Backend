import sgMail from '@sendgrid/mail';
import axios from 'axios';
import Stripe from 'stripe';
import moment from 'moment';
import _ from 'lodash';
import { Client } from '@notionhq/client';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
	CALENDAR_API_KEY,
	CALENDAR_ID,
	RECAPTCHA_SECRET_KEY,
	SENDGRID_API_KEY,
	STRIPE_API_KEY,
	NOTION_TOKEN,
	NOTION_TUTOR_DB,
} from '../config';
import { logger } from '../logger';

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

exports.addToSheets = async function addToSheets(
	firstName,
	lastName,
	email,
	uhID,
	paidUntil,
	phone,
	classification
) {
	const doc = new GoogleSpreadsheet(
		'1fXguE-6AwXAihOkA39Ils28zn1ZkpClaFGUrJpNHodI'
	);

	await doc.useServiceAccountAuth(require('../../../gsheet.json'));
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];
	await sheet.addRow({
		Timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
		Email: email,
		'First Name': firstName,
		'Last Name': lastName,
		PeopleSoft: uhID,
		Classification: classification,
		'Paid Until': paidUntil,
		'Payment Method': 'Stripe',
		'Phone Number': phone,
	});
	logger.info({
		service: 'payment',
		message: 'Added user to Google Sheets',
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
