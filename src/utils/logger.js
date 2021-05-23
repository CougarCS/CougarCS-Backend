import { createLogger, config, transports } from 'winston';
import { NODE_ENV } from './config';

let level;
let silent;

if (NODE_ENV === 'test') {
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

const logger = createLogger({
	levels: config.npm.levels,
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
