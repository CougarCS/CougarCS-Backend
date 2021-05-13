import { createLogger, config, transports } from 'winston';

const options = {
	file: {
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: true,
	},
	console: {
		level: 'debug',
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
