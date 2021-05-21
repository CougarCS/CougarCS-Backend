import cors from 'cors';
import 'dotenv/config';
import express, { json } from 'express';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import actuator from 'express-actuator';
import email from '../api/routes/email';
import events from '../api/routes/event';
import payment from '../api/routes/payment';
import { logger } from '../utils/logger';
import { httpLogger } from '../utils/httpLogger';
import { SENTRY_URL } from '../utils/config';

const app = express();

const limiter = new RateLimit({
	windowMs: 1 * 60 * 1000,
	max: 90,
});

Sentry.init({
	dsn: SENTRY_URL,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({
			app,
		}),
	],
	tracesSampleRate: 1.0,
});

const corsOptions = {
	origin: 'https://cougarcs.com',
};

app.use(
	Sentry.Handlers.requestHandler({
		ip: true,
	})
);
app.use(Sentry.Handlers.tracingHandler());
app.use(limiter);
app.use(cors(corsOptions));
app.use(httpLogger);
app.use(helmet());
app.use(json({ extended: false }));
app.use(actuator());

app.get('/', (req, res) => {
	res.json({ welcome: 'CougarCS Backend 🐯' });
});

app.use('/api/payment', payment);
app.use('/api/send', email);
app.use('/api/events', events);

app.use(Sentry.Handlers.errorHandler());

// eslint-disable-next-line no-unused-vars
app.use(function onError(err, req, res, next) {
	logger.error(
		`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
			req.method
		} - ${req.ip}`
	);

	res.statusCode = 500;
	res.end(`${res.sentry}\n`);
});

export default app;
