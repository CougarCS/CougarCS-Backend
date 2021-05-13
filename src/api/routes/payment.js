import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail';
import axios from 'axios';
import moment from 'moment';
import { logger } from '../../utils/logger';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

router.post(
	'/',
	[
		check('user.firstName').not().isEmpty().trim().escape(),

		check('user.lastName').not().isEmpty().trim().escape(),

		check('user.email').not().isEmpty().isEmail().normalizeEmail(),

		check('user.uhID')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isLength({ min: 7, max: 7 })
			.withMessage('Bad Request!'),

		check('user.classification').not().isEmpty().trim().escape(),

		check('user.paidUntil')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.matches(/(semester|year)/)
			.withMessage('Bad Request!'),

		check('user.phone')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
			.withMessage('Bad Request!'),

		check('recaptchaToken').not().isEmpty().trim().escape(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			logger.info(errors);
			return res.status(500).json({ errors: errors.array() });
		}

		const { token, user, recaptchaToken } = req.body;

		// check recaptcha
		const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptcha_secret_key}&response=${recaptchaToken}`;

		const resp = await axios.post(verificationUrl);

		if (!resp.data.success) {
			logger.info('Failed to validate ReCaptcha');
			return res
				.status(500)
				.json({ message: 'Failed to validate ReCaptcha' });
		}

		const idempotencyKey = uuidv4();

		let amount = 0;
		if (user.paidUntil === 'semester') {
			amount = 1000;
		} else if (user.paidUntil === 'year') {
			amount = 1800;
		} else {
			logger.info('Invalid paidUntil');
			return res.status(500).json({ message: 'Bad Request!' });
		}

		// create customer
		try {
			stripe.customers
				.create({
					email: user.email,
					phone: user.phone,
					name: `${user.firstName} ${user.lastName}`,
					metadata: {
						'UH ID': user.uhID,
						'Paid For': user.paidUntil,
					},
				})
				// create payment intent and charge customer
				.then((customer) => {
					stripe.paymentIntents.create(
						{
							amount,
							currency: 'USD',
							description: 'Membership Payment',
							payment_method: token,
							customer: customer.id,
							confirm: true,
							receipt_email: user.email,
						},
						{ idempotencyKey }
					);
				});
			logger.info({
				service: 'payment',
				msg: 'Payment create',
				meta: { payee: user.uhID },
			});
		} catch (err) {
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);
			return res.status(500).json({ message: 'Payment Error!' });
		}

		// GOOGLE SHEETS;
		try {
			const doc = new GoogleSpreadsheet(
				'1fXguE-6AwXAihOkA39Ils28zn1ZkpClaFGUrJpNHodI'
			);

			await doc.useServiceAccountAuth(require('../../gsheet.json'));
			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[0];
			await sheet.addRow({
				Timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
				Email: user.email,
				'First Name': user.firstName,
				'Last Name': user.lastName,
				PeopleSoft: user.uhID,
				Classification: user.classification,
				'Paid Until': user.paidUntil,
				'Payment Method': 'Stripe',
				'Phone Number': user.phone,
			});
			logger.info({
				service: 'payment',
				message: 'Added user to Google Sheets',
			});
		} catch (err) {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				to: 'webmaster@cougarcs.com',
				from: 'info@cougarcs.com',
				subject: 'GSheet Error on Website Payments',
				text: toString(err),
			};
			sgMail.send(msg);
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);
		}
		logger.info('Payment Success');
		return res.status(200).json({ message: 'OK' });
	}
);

export default router;
