import { Router } from 'express';
import moment from 'moment';
import APICall from '../../utils/api/calls';
import { logger } from '../../utils/logger';
import { CACHE_TIME } from '../../utils/config';
import cache from '../../utils/cache';

const router = new Router();

const renameKey = (obj, oldKey, newKey) => {
	if (oldKey !== newKey && !obj.date) {
		Object.defineProperty(
			obj,
			newKey,
			Object.getOwnPropertyDescriptor(obj, oldKey)
		);
		delete obj[oldKey];
	}
};

router.get('/', async (req, res) => {
	const key = 'event';
	const cacheContent = cache.get(key);
	if (cacheContent) {
		logger.info('Events sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		const data = await APICall.getEvents();
		const now = moment();
		const futureEvents = [];
		const pastEvents = [];
		data.items
			.filter((obj) => obj?.start?.date || obj?.start?.dateTime)
			.forEach((obj) => {
				renameKey(obj.start, 'dateTime', 'date');
				renameKey(obj.end, 'dateTime', 'date');

				if (moment(obj.start.date) > now) {
					futureEvents.push(obj);
				}
				if (
					moment(obj.start.date) < now &&
					moment(obj.start.date) > moment().subtract(1, 'year')
				) {
					pastEvents.push(obj);
				}
			});

		logger.info('Events sent');

		cache.put(key, { futureEvents, pastEvents }, CACHE_TIME);
		logger.info('Stored events in cache');
		return res.status(200).json({ futureEvents, pastEvents });
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
