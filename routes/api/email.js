/* eslint-disable no-tabs */
/* eslint-disable indent */
import sgMail from '@sendgrid/mail';
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import moment from 'moment';

const router = Router();

router.post(
	'/',
	[
		check('firstName', 'First Name is required').not().isEmpty(),
		check('lastName', 'Last Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('body', 'Body is required').not().isEmpty(),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ msg: errors.array() });
		}
		const { firstName, lastName, email, body } = req.body;
		const content = `Name: ${firstName} ${lastName} \nEmail: ${email} \nMessage: ${body} `;
		try {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				to: 'webmaster@cougarcs.com',
				from: email,
				subject: 'New Message from Contact Form',
				text: content,
			};
			sgMail.send(msg);
			// res.status(200).send('Email sent.');
		} catch (err) {
			res.status(500).json(err);
		}

		// GOOGLE SHEETS
		try {
			const doc = new GoogleSpreadsheet(
				'1fXguE-6AwXAihOkA39Ils28zn1ZkpClaFGUrJpNHodI'
			);
			await doc.useServiceAccountAuth({
				client_email: process.env.client_email,
				private_key: process.env.private_key,
			});
			// await doc.useServiceAccountAuth(
			// 	JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS)
			// );
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[0];
			await sheet.addRow({
				Timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
				Email: 'Test',
				'First Name': 'Test',
				'Last Name': 'Test',
				PeopleSoft: 'Test',
				Classification: 'Test',
				'Paid Until': 'Test',
				'Payment Method': 'Stripe',
				'Phone Number': 'Test',
			});
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}

		res.status(200).send('Email sent.');
	}
);

export default router;
