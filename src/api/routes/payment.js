import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger/logger';
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
		check('user.shirtSize', 'Shirt Size is required')
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
		const {
			firstName,
			lastName,
			email,
			uhID,
			shirtSize,
			paidUntil,
			phone,
		} = user;

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
			await APICall.createStripeCustomer(
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

		try {
			await APICall.postContact({
				transaction: `Payment via Stripe on ${new Date().toLocaleDateString()}`,
				firstName,
				lastName,
				email,
				uhID,
				phone,
				shirtSize,
				paidUntil,
			});
		} catch (err) {
			await APICall.sendEmail(
				[
					'vyas.r@cougarcs.com',
					'ben@cougarcs.com',
					'webmaster@cougarcs.com',
					'president@cougarcs.com',
					'vice.president@cougarcs.com',
				],
				{ name: 'Payment Failure', email: 'info@cougarcs.com' },
				'CougarCS Cloud API - postContact Failed',
				JSON.stringify({
					name: `${firstName} ${lastName}`,
					email,
					uhID,
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

/* webhook setup to handle successful Payments (https://docs.stripe.com/checkout/fulfillment) */
router.post(
	'/sessionRegister',
	[
		check('sessionId', 'Session ID is required')
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

		const { sessionId } = req.body;

		let session = null;
		let paymentDetails = {};

		try {
			session = await APICall.getStripeSessionData(sessionId);

			if (!session || session.status === 'unpaid') {
				return res
					.status(500)
					.json({ message: 'Payment incomplete or invalid.' });
			}

			paymentDetails.uhID = session.custom_fields.find(
				(field) => field.key === 'uhID'
			).numeric.value;

			paymentDetails.shirtSize = session.custom_fields.find(
				(field) => field.key === 'shirtSize'
			).dropdown.value;

			paymentDetails.paidUntil = session.metadata.tenure;
		} catch (err) {
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);
			return res
				.status(500)
				.json({ message: 'Failed to retrieve session' });
		}

		try {
			const customer = await APICall.getStripeCustomerData(
				session.customer
			);

			paymentDetails = {
				firstName: customer.name ? customer.name.split(' ')[0] : null,
				lastName: customer.name
					? customer.name.split(' ').slice(1).join(' ')
					: '',
				email: customer.email,
				phone: customer.phone,
			};
		} catch (err) {
			await APICall.sendEmail(
				[
					'webmaster@cougarcs.com',
					'president@cougarcs.com',
					'vice.president@cougarcs.com',
				],
				{ name: 'Payment Failure', email: 'info@cougarcs.com' },
				'CougarCS Cloud API - postContact Failed',
				JSON.stringify({
					sessionId: session.id,
					err: err.message,
				})
			);

			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);

			return res
				.status(500)
				.json({ message: 'Failed to retrieve customer' });
		}

		const {
			firstName,
			lastName,
			email,
			uhID,
			shirtSize,
			paidUntil,
			phone,
		} = paymentDetails;

		try {
			if (session.livemode) {
				await APICall.postContact({
					transaction: `Payment via Stripe on ${new Date().toLocaleDateString()}`,
					firstName,
					lastName,
					email,
					uhID,
					phone,
					shirtSize,
					paidUntil,
				});
			} else {
				logger.info(
					`[TEST MODE] POST to CougarCS Cloud API for UHID=${uhID}`
				);
			}
		} catch (err) {
			await APICall.sendEmail(
				[
					'webmaster@cougarcs.com',
					'president@cougarcs.com',
					'vice.president@cougarcs.com',
				],
				{ name: 'Payment Failure', email: 'info@cougarcs.com' },
				'CougarCS Cloud API - postContact Failed',
				JSON.stringify({
					name: `${firstName} ${lastName}`,
					email,
					uhID,
					err: err.message,
				})
			);

			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);

			return res.status(500).json({ message: 'Failed to write to DB' });
		}

		return res.status(200).json({ message: 'OK' });
	}
);

export default router;
