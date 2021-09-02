import { Router } from 'express';
import { logger } from '../../utils/logger/logger';
import APICall from '../../utils/api/calls';
import { CACHE_TIME } from '../../utils/config';
import { getCache, setCache } from '../../utils/caching/cacheData';
import {
	endSpanWrapper,
	getSpanWrapper,
} from '../../utils/tracing/tracerWrapper';

const router = Router();
const key = 'tutor';

router.get('/', async (req, res) => {
	const parentSpan = getSpanWrapper();
	const cacheContent = getCache(key, parentSpan);
	if (cacheContent) {
		logger.info('Tutors sent from cache');
		endSpanWrapper(parentSpan);
		return res.status(200).json(cacheContent);
	}
	try {
		const { tutors } = await APICall.getTutors(parentSpan);

		setCache(key, { tutors }, CACHE_TIME, parentSpan);
		logger.info('Stored tutors in cache');

		logger.info('Tutors sent');
		endSpanWrapper(parentSpan);
		return res.status(200).json({ tutors });
	} catch (err) {
		logger.error(
			`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
				req.method
			} - ${req.ip}`
		);
		endSpanWrapper(parentSpan);
		return res.status(500).json({ err, message: 'Unable to get tutors' });
	}
});

export default router;
