import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { SEND_EMAIL } from '../../utils/config';
import { logger } from '../../utils/logger/logger';
import APICall from '../../utils/api/calls';

const router = Router();

const toEmail = SEND_EMAIL;

router.post(
	'/',
	[
		check('firstName', 'First Name is required').not().isEmpty(),
		check('lastName', 'Last Name is required').not().isEmpty(),
		check('email', 'Email is required').isEmail(),
		check('body', 'Body is required').not().isEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			logger.info(errors);
			return res.status(400).json({ message: errors.array() });
		}
		const { firstName, lastName, email, body } = req.body;
		const content = `Name: ${firstName} ${lastName} \nEmail: ${email} \nMessage: ${body} `;
		try {
			await APICall.sendEmail(
				toEmail,
				{
					name: 'CougarCS Website Contact Form',
					email,
				},
				'New Message from Contact Form',
				content
			);
		} catch (err) {
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);

			return res.status(500).json({ message: err.message });
		}
		logger.info('Email sent');
		return res.status(200).json({ message: 'Email sent.' });
	}
);

export default router;
