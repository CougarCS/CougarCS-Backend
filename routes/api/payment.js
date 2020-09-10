/* eslint-disable no-tabs */
/* eslint-disable indent */
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
// import { GoogleSpreadsheet } from 'google-spreadsheet';
import Stripe from 'stripe';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const stripe = new Stripe(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {

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

	// try {
	// 	const payment = await stripe.paymentIntents.create({
	// 		amount,
	// 		currency: 'USD',
	// 		description: 'TEST PAYMENT',
	// 		payment_method: token,
	// 		confirm: true
	// 	});

	return stripe.customers.create({
		email: user.email,
		phone: user.phone,
		name: user.firstName + ' ' + user.lastName,
		metadata: {
			"UH ID": user.uhID,
			"Paid For": user.paidUntil
		}
	})
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
		.then(result => res.status(200).json(result))
		.catch(err => {
			console.log(err);
			res.status(503).json(err);
		})

	// 	console.log(payment);
	// 	return res.status(200).json({response: "Works!"});

	// } catch (err) {
	// 	console.log(err);
	// 	return res.status(503).json(err);
	// }


	// GOOGLE SHEETS
	// try {
	// 	const doc = new GoogleSpreadsheet(
	// 		'1fXguE-6AwXAihOkA39Ils28zn1ZkpClaFGUrJpNHodI'
	// 	);
	// 	await doc.useServiceAccountAuth({
	// 		client_email: process.env.client_email,
	// 		private_key: process.env.private_key,
	// 	});
	// 	await doc.loadInfo();
	// 	const sheet = doc.sheetsByIndex[0];
	// 	await sheet.addRow({
	// 		Timestamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
	// 		Email: email,
	// 		'First Name': firstName,
	// 		'Last Name': lastName,
	// 		PeopleSoft: uhID,
	// 		Classification: classification,
	// 		'Paid Until': paidUntil,
	// 		'Payment Method': paymentMethod,
	// 		'Phone Number': phoneNumber,
	// 	});
	// } catch (err) {
	// 	return res.json(err);
	// }
	// res.send('Hello');
});

export default router;
