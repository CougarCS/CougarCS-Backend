/* eslint-disable no-tabs */
/* eslint-disable indent */
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import Stripe from 'stripe';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_API_KEY);

router.post(
	'/',
	[
		check('user.firstName')
			.not().isEmpty().trim().escape(),

		check('user.lastName')
			.not().isEmpty().trim().escape(),

		check('user.email')
			.not().isEmpty()
			.isEmail().normalizeEmail(),

		check('user.uhID')
			.not().isEmpty().trim().escape()
			.isLength({ min: 7, max: 7 }).withMessage('Bad Request!'),

		check('user.classification')
			.not().isEmpty().trim().escape(),

		check('user.paidUntil')
			.not().isEmpty().trim().escape()
			.matches(/(semester|year)/).withMessage('Bad Request!'),
		
		check('user.phone')
			.not().isEmpty().trim().escape()
			.matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).withMessage('Bad Request!'),

	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(500).json({ errors: errors.array() });
		}

		// console.log(req.body);
		const {
			token,
			user
		} = req.body;
		const idempotencyKey = uuidv4();

		let amount = 0;
		if (user.paidUntil == "semester") {
			amount = 1000;
		} else if (user.paidUntil == "year") {
			amount = 1800;
		} else {
			return res.status(500).json({ response: "Bad Request!" })
		}

		let result

		// create customer
		stripe.customers.create({
			email: user.email,
			phone: user.phone,
			name: user.firstName + ' ' + user.lastName,
			metadata: {
				"UH ID": user.uhID,
				"Paid For": user.paidUntil
			}
		})
			// create payment intent and charge customer
			.then(customer => {
				stripe.paymentIntents.create({
					amount,
					currency: 'USD',
					description: 'Membership Payment',
					payment_method: token,
					customer: customer.id,
					confirm: true,
					receipt_email: 'secretary@cougarcs.com',
				}, { idempotencyKey })
			})


		// GOOGLE SHEETS
		try {
			const doc = new GoogleSpreadsheet(
				'1fXguE-6AwXAihOkA39Ils28zn1ZkpClaFGUrJpNHodI'
			);
			await doc.useServiceAccountAuth({
				client_email: process.env.client_email,
				private_key: process.env.private_key,
			});
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
				'Payment Method': "Stripe",
				'Phone Number': user.phone,
			});
		} catch (err) {
			console.log(err);
			return res.json(err);
		}

		return res.status(200).json({ 'response': "WORKED!" });

	}
);

export default router;
