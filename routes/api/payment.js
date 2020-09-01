/* eslint-disable no-tabs */
/* eslint-disable indent */
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import moment from 'moment';
const router = Router();

router.post('/', async (req, res) => {
	const {
		email,
		firstName,
		lastName,
		uhID,
		classification,
		paidUntil,
		paymentMethod,
		phoneNumber,
	} = req.body;

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
			Email: email,
			'First Name': firstName,
			'Last Name': lastName,
			PeopleSoft: uhID,
			Classification: classification,
			'Paid Until': paidUntil,
			'Payment Method': paymentMethod,
			'Phone Number': phoneNumber,
		});
	} catch (err) {
		return res.json(err);
	}
	res.send('Hello');
});

export default router;
