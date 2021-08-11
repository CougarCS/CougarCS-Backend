/* eslint-disable import/no-named-as-default */
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger';
import APICall from '../../utils/api/calls';

const router = Router();

router.post(
	'/',
	[
		check('user.firstName', 'First Name is required')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('user.lastName', 'Last Name is required')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('user.email', 'Email is required')
			.not()
			.isEmpty()
			.isEmail()
			.normalizeEmail(),
		check('user.uhID', 'UHID is required')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.isLength({ min: 7, max: 7 }),

		check('user.classification', 'Classification is required')
			.not()
			.isEmpty()
			.trim()
			.escape(),
		check('user.paidUntil', 'Paid Until is required')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.matches(/(semester|year)/),
		check('user.phone', 'Phone Number is required')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
		check('recaptchaToken', 'Recaptcha Token is required')
			.not()
			.isEmpty()
			.trim()
			.escape(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			logger.info(errors);
			return res.status(500).json({ message: errors.array() });
		}

		const { token, user, recaptchaToken } = req.body;
		const { firstName, lastName, email, uhID, paidUntil, phone } = user;

		// check recaptcha
		const resp = await APICall.checkRecaptcha(recaptchaToken);

		if (!resp.data.success) {
			logger.info('Failed to validate ReCaptcha');
			return res
				.status(500)
				.json({ message: 'Failed to validate ReCaptcha' });
		}

		const idempotencyKey = uuidv4();

		let amount = 0;
		if (paidUntil === 'semester') {
			amount = 2500;
		} else {
			amount = 4000;
		}

		try {
			APICall.createStripeCustomer(
				firstName,
				lastName,
				email,
				uhID,
				paidUntil,
				phone,
				amount,
				token,
				idempotencyKey
			);
		} catch (err) {
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);
			return res.status(500).json({ message: 'Payment Error!' });
		}

		// CALL COUGARCS API
		try {
			await APICall.postContact(user);
		} catch (err) {
			await APICall.sendEmail(
				['vyas.r@cougarcs.com', 'webmaster@cougarcs.com'],
				{ name: 'Payment Failure', email: 'info@cougarcs.com' },
				'GSheet Error on Website Payments',
				JSON.stringify({
					name: `${firstName} ${lastName}`,
					email,
					err: err.message,
				})
			);
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
