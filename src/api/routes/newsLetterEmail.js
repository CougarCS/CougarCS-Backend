import { logger } from '@sentry/utils';
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { SEND_EMAIL } from '../../utils/config';
import APICall from '../../utils/api/calls';

const router = Router();

const toEmail = SEND_EMAIL;

router.post(
    '/',
    [
        check('firstName', 'First Name is required').not().isEmpty(),
        check('lastName', 'LastName is required').not().isEmpty(),
        check('email', 'Email is required').isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.info(errors);
            return res.status(400).json({ message: errors.array() });
        }
        const content = `Name: ${firstName} ${lastName} \nEmail: ${email}`;
        try {
            await APICall.sendEmail(
                toEmail,
                {
                    name: 'CougarCS Website Newsletter',
                    email,
                },
                'New Message from Newsletter',
                content
            );
        } catch (err) {
            logger.error(
                `${err.status || 500} - ${err.message} - ${req.originalUrl} 
                - ${req.method} - ${req.ip}`
            );
            return res.status(500).json({ message: err.message });
        }
        logger.info('Email of Newsletter sent');
        return res.status(200).json({ message: 'Email of Newsletter sent.' });
    }
);
export default router;