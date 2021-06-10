import { Router } from 'express';
import moment from 'moment';
import _ from 'lodash';
import APICall from '../../utils/api/calls';
import { logger } from '../../utils/logger';
import { CACHE_TIME } from '../../utils/config';
import { getCache, setCache } from '../../utils/cacheData';

const router = new Router();
const key = 'event';

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
	const cacheContent = getCache(key);
	if (cacheContent) {
		logger.info('Events sent from cache');
		return res.status(200).json(cacheContent);
	}
	try {
		const data = await APICall.getEvents();
		let events = [];
		data.items
			.filter((obj) => obj?.start?.date || obj?.start?.dateTime)
			.forEach((obj) => {
				renameKey(obj.start, 'dateTime', 'date');
				renameKey(obj.end, 'dateTime', 'date');
				events.push({
					start: obj.start.date,
					end: obj.end.date,
					title: obj.summary,
					desc: obj?.description ? obj.description : 'TBD',
				});
			});

		events = _.sortBy(events, (o) => moment(o.start));
		logger.info('Events sent');

		setCache(key, { events }, CACHE_TIME);
		logger.info('Stored events in cache');
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
