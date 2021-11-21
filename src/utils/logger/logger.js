import newrelicFormatter from '@newrelic/winston-enricher';
import winston, { createLogger, config, transports, format } from 'winston';
import { TEST } from '../config';

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
		timestamp: true,
	},
};

const logger = createLogger({
	levels: config.npm.levels,
	format: winston.format.combine(
		format.timestamp({ format: 'MM-DD-YYYY hh:mm:ss' }),
		newrelicFormatter(),
		winston.format.json()
	),
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
