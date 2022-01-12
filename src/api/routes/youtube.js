import { Router } from 'express';
import { logger } from '../../utils/logger/logger';
import APICall from '../../utils/api/calls';
import { CACHE_TIME } from '../../utils/config';
import { getCache, setCache } from '../../utils/caching/cacheData';

const router = Router();
const key = 'youtube';

router.get('/', async (req, res) => {
	const cacheContent = getCache(key);
	if (cacheContent) {
		logger.info('Videos sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		const { videos } = await APICall.getYoutubeVideos();

		setCache(key, { videos }, CACHE_TIME);
		logger.info('Stored videos in cache');

		logger.info('Videos sent');
		return res.status(200).json({ videos });
	} catch (err) {
		logger.error(
			`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
				req.method
			} - ${req.ip}`
		);
		return res.status(500).json({ err, message: 'Unable to get videos' });
	}
});

export default router;
