/* eslint-disable indent */
import { Router } from 'express';
import { check, validationResult } from 'express-validator/check';
import nodemailer from 'nodemailer';

const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email Ready');
    }
});

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

    const mail = {
        from: email,
        to: 'info@cougarcs.com',
        subject: 'New Message from Contact Form',
        text: content,
    };

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                msg: err,
            });
        } else {
            res.json({
                msg: data,
            });
        }
    });
});

export default router;
