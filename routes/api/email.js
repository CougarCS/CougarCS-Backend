/* eslint-disable indent */
import sgMail from '@sendgrid/mail';
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';

const router = Router();

router.post('/', [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required')
        .not()
        .isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('body', 'Body is required').not().isEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { body } = req.body;
    const content = `Name: ${firstName} ${lastName} \nEmail: ${email} \nMessage: ${body} `;

    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: process.env.USER_EMAIL,
            from: email,
            subject: 'New Message from Contact Form',
            text: content,
        };
        sgMail.send(msg);
        res.status(200).send('Email sent.');
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
