import { Router } from 'express';
import { logger } from '../../utils/logger';
import APICall from '../../utils/api/calls';
import { CACHE_TIME } from '../../utils/config';
import cache from '../../utils/cache';

const router = Router();

router.get('/', async (req, res) => {
	// Check Cache
	const key = 'tutors';
	const cacheContent = cache.get(key);
	if (cacheContent) {
		logger.info('Events sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		// API Request
		const data = await APICall.getTutors();
		logger.info('Tutors sent');
		const tutors = data.results
			// remove empty data
			.filter((obj) => obj?.properties?.Name?.title[0]?.text.content)
			// remove extra properties
			.map((obj) => {
				return {
					name: obj.properties.Name.title[0].text.content,
					linkedin: obj.properties?.LinkedIn?.url,
				};
			});

		// Store in Cache
		cache.put(key, { data }, CACHE_TIME);
		logger.info('Stored tutors in cache');

		return res.status(200).json({ tutors });
	} catch (err) {
		// Error Management
		logger.error(
			`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
				req.method
			} - ${req.ip}`
		);
		return res.status(500).json({ message: 'Unable to get tutors' });
	}
});

export default router;
