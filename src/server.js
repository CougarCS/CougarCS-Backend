import 'dotenv/config';
import app from './config/app';
import cache from './utils/cache';
import { PORT } from './utils/config';
import { logger } from './utils/logger';

const APP_PORT = PORT || 4000;
const server = app.listen(PORT, (err) => {
	try {
		if (err) throw err;
		logger.info(`Running on port ${APP_PORT}`);
	} catch (e) {
		logger.error(e);
	}
});

const handleShutdownGracefully = () => {
	logger.info('SERVER: Closing server gracefully...');
	server.close(() => {
		logger.info('SERVER: Server closed.');
		cache.clear();
		logger.info('Cache Cleared');
	});
};
process.on('SIGINT', handleShutdownGracefully);
process.on('SIGTERM', handleShutdownGracefully);
process.on('SIGHUP', handleShutdownGracefully);
