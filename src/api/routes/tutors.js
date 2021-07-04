import { Router } from 'express';
import { logger } from '../../utils/logger';
import APICall from '../../utils/api/calls';
import { CACHE_TIME } from '../../utils/config';
import { getCache, setCache } from '../../utils/cacheData';

const router = Router();
const key = 'tutor';

router.get('/', async (req, res) => {
	const cacheContent = getCache(key);
	if (cacheContent) {
		logger.info('Tutors sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		const { tutors } = await APICall.getTutors();

		setCache(key, { tutors }, CACHE_TIME);
		logger.info('Stored tutors in cache');

		logger.info('Tutors sent');
		return res.status(200).json({ tutors });
	} catch (err) {
		logger.error(
			`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
				req.method
			} - ${req.ip}`
		);
		return res.status(500).json({ err, message: 'Unable to get tutors' });
	}
});

export default router;
