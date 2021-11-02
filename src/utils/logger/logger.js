import winston, { createLogger, config, transports } from 'winston';
import { TEST } from '../config';
import { getSpanWrapper } from '../tracing/tracerWrapper';

let level;
let silent;

if (TEST) {
	level = 'emerg';
	silent = true;
} else {
	level = 'debug';
	silent = false;
}

const options = {
	file: {
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: true,
	},
	console: {
		level,
		silent,
		handleExceptions: true,
		json: false,
		colorize: true,
	},
};

const tracingFormat = () => {
	return winston.format((info) => {
		const span = getSpanWrapper();
		if (span) {
			const context = span.spanContext();
			info.trace_id = context.traceId;
			info.span_id = context.spanId;
		}
		return info;
	})();
};

const logger = createLogger({
	levels: config.npm.levels,
	format: winston.format.combine(tracingFormat(), winston.format.json()),
	transports: [
		new transports.File({
			...options.file,
			level: 'info',
			filename: './logs/info.log',
		}),
		new transports.File({
			...options.file,
			level: 'error',
			filename: './logs/error.log',
		}),
		new transports.Console(options.console),
	],
	exitOnError: false,
});

export { logger };
