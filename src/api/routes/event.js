import { Router } from 'express';
import _ from 'lodash';
import moment from 'moment';
import APICall from '../../utils/api/calls';
import { logger } from '../../utils/logger';
import { CACHE_TIME } from '../../utils/config';
// import singletonCache from '../../utils/cache';
// import client from '../../utils/cache';
import redis from '../../utils/cache';

const router = new Router();
// const memCache = singletonCache;

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
	// const cacheContent = memCache.get(key);
	// if (cacheContent) {
	// 	return res.status(200).json(cacheContent);
	// }
	try {
		// client.get(key, async (err, eventData) => {
		// 	if (err) {
		// 		throw new Error(err.message);
		// 	}
		// 	if (eventData) {
		// 		logger.info('Fetch events from cache');
		// 		return res.status(200).json(JSON.parse(eventData));
		// 	}
		const eventCache = await redis.get(key);
		if (eventCache) {
			logger.info('Fetch events from cache');
			return res.status(200).json(JSON.parse(eventCache));
		}
		const data = await APICall.getEvents();
		const now = moment();
		let futureEvents = [];
		let pastEvents = [];

		data.items.forEach((item) => {
			if (item.start === undefined) {
				return;
			}
			if (item.start.date !== undefined) {
				if (moment(item.start.date) > now) {
					futureEvents.push(item);
				}
				if (
					moment(item.start.date) < now &&
					moment(item.start.date) > moment().subtract(1, 'year')
				) {
					pastEvents.push(item);
				}
			} else {
				if (moment(item.start.dateTime) > now) {
					futureEvents.push(item);
				}
				if (
					moment(item.start.dateTime) < now &&
					moment(item.start.dateTime) > moment().subtract(1, 'year')
				) {
					pastEvents.push(item);
				}
			}
		});

		futureEvents.forEach((obj) => renameKey(obj.start, 'dateTime', 'date'));
		futureEvents.forEach((obj) => renameKey(obj.end, 'dateTime', 'date'));
		pastEvents.forEach((obj) => renameKey(obj.start, 'dateTime', 'date'));
		pastEvents.forEach((obj) => renameKey(obj.end, 'dateTime', 'date'));

		futureEvents = _.sortBy(futureEvents, (o) => moment(o.start.date));
		pastEvents = _.sortBy(pastEvents, (o) =>
			moment(o.start.date)
		).reverse();
		logger.info('Events sent');
		await redis.set(
			key,
			JSON.stringify({ futureEvents, pastEvents }),
			'EX',
			CACHE_TIME
		);
		logger.info('Stored events in cache');
		// client.setex(
		// 	key,
		// 	30,
		// 	JSON.stringify({ futureEvents, pastEvents })
		// );
		// memCache.put(key, { futureEvents, pastEvents }, CACHE_TIME);
		return res.status(200).json({ futureEvents, pastEvents });
		// });
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
