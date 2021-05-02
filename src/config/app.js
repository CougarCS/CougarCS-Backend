/* eslint-disable import/no-named-as-default-member */
import cors from 'cors';
import 'dotenv/config';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import RateLimit from 'express-rate-limit';
import email from '../api/routes/email';
import events from '../api/routes/event';
import payment from '../api/routes/payment';

const limiter = new RateLimit({
	windowMs: 1 * 60 * 1000,
	max: 10,
});

const app = express();
app.use(limiter);
app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(json({ extended: false }));

app.get('/', (req, res) => {
	res.json({ welcome: 'CougarCS Backend 🐯' });
});

app.use('/api/payment', payment);
app.use('/api/send', email);
app.use('/api/events', events);

app.use((req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
});
app.use((error, req, res) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: error.message,
		stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
	});
});

export default app;
