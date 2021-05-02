import sgMail from '@sendgrid/mail';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';

const router = Router();

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
			return res.status(400).json({ msg: errors.array() });
		}
		const { firstName, lastName, email, body } = req.body;
		const content = `Name: ${firstName} ${lastName} \nEmail: ${email} \nMessage: ${body} `;
		try {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				to: 'info@cougarcs.com',
				from: email,
				subject: 'New Message from Contact Form',
				text: content,
			};
			sgMail.send(msg);
		} catch (err) {
			return res.status(500).json(err);
		}

		return res.status(200).send('Email sent.');
	}
);

export default router;
