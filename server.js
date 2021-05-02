import 'dotenv/config';
import app from './src/config/app';
import { logger } from './src/utils/logger';

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
	try {
		if (err) throw err;
		logger.info(`Running on port ${PORT}`);
	} catch (e) {
		logger.error(e);
	}
});
