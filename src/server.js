import 'dotenv/config';
import app from './config/app';
import { PORT } from './utils/config';
import { logger } from './utils/logger';

const APP_PORT = PORT || 4000;
app.listen(PORT, (err) => {
	try {
		if (err) throw err;
		logger.info(`Running on port ${APP_PORT}`);
	} catch (e) {
		logger.error(e);
	}
});
