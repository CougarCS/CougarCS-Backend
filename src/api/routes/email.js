import sgMail from '@sendgrid/mail';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { logger } from '../../utils/logger';

const router = Router();

const toEmail =
	process.env.NODE_ENV === 'prod' ? 'info@cougarcs.com' : 'test@test.com';

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
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				to: toEmail,
				from: email,
				subject: 'New Message from Contact Form',
				text: content,
			};
			sgMail.send(msg);
			logger.info(
				`Service: Contact Form - Email has been sent. From: ${email}`
			);
		} catch (err) {
			logger.error(
				`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
					req.method
				} - ${req.ip}`
			);

			return res.status(500).json(err);
		}
		logger.info('Email sent');
		return res.status(200).json({ message: 'Email sent.' });
	}
);

export default router;
