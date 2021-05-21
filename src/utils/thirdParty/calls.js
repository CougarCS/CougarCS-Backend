import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '../config';
import { logger } from '../logger';

async function sendEmail(toEmail, email, subject, content) {
	sgMail.setApiKey(SENDGRID_API_KEY);
	const msg = {
		to: toEmail,
		from: email,
		subject,
		text: content,
	};
	await sgMail.send(msg);
	logger.info(
		`Service: Contact Form - Email has been sent. From: ${email.email}`
	);
}

exports.sendEmail = sendEmail;
