import { Router } from 'express';
import APICall from '../../utils/api/calls';
import { logger } from '../../utils/logger/logger';
import { CACHE_TIME } from '../../utils/config';
import { getCache, setCache } from '../../utils/caching/cacheData';

const router = new Router();
const key = 'event';

router.get('/', async (req, res) => {
	const cacheContent = getCache(key);
	if (cacheContent) {
		logger.info('Events sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		const { events } = await APICall.getEvents();

		setCache(key, { events }, CACHE_TIME);
		logger.info('Stored events in cache');

		logger.info('Events sent');
		return res.status(200).json({ events });
	} catch (err) {
		logger.error(
			`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
				req.method
			} - ${req.ip}`
		);
		return res.status(500).json({ message: err.message });
	}
});

export default router;
