/* eslint-disable no-unused-vars */
import cors from 'cors';
import 'dotenv/config';
import express, { json } from 'express';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import actuator from 'express-actuator';
import compression from 'compression';
import tracing from '@opencensus/nodejs';
import { B3Format } from '@opencensus/propagation-b3';
import { ZipkinTraceExporter } from '@opencensus/exporter-zipkin';
import email from '../api/routes/email';
import events from '../api/routes/event';
import tutors from '../api/routes/tutors';
import payment from '../api/routes/payment';
import { logger } from '../utils/logger';
import { httpLogger } from '../utils/httpLogger';
import { ENABLE_CORS, PROD, SENTRY_URL, TEST } from '../utils/config';
import { bundle } from '../utils/prometheus';

const exporter = new ZipkinTraceExporter({
	url: 'http://localhost:9411/api/v2/spans',
	serviceName: 'cougarcs',
});

// NOTE: Please ensure that you start the tracer BEFORE initializing express app
// Starts tracing and set sampling rate, exporter and propagation
const { tracer } = tracing.start({
	samplingRate: 1, // For demo purposes, always sample
	propagation: new B3Format(),
	logLevel: 1, // show errors, if any
});

tracer.registerSpanEventListener(exporter);

const app = express();

const limiter = new RateLimit({
	windowMs: 1 * 60 * 1000,
	max: 90,
});

if (PROD) {
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
}

const corsOptions = ENABLE_CORS
	? {
		origin: ['https://cougarcs.com', 'http://localhost:45678'],
		methods: ['GET', 'POST'],
	}
	: '*';

if (!TEST) {
	app.use(bundle);
}
app.use(compression());
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
app.use('/api/tutors', tutors);

app.use((req, res) => {
	throw new Error(`Invaild Request - Endpoint: ${req.originalUrl}`);
});

app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
	logger.info(
		`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method
		} - ${req.ip}`
	);

	res.status(500).json({ message: err.message });
});

export default app;
