import opentelemetry, { context } from '@opentelemetry/api';
import cache from './cache';
import { TEST } from '../config';
import { tracer } from '../tracing/tracer';

const getCache = (key, parentSpan) => {
	if (!TEST) {
		const ctx = opentelemetry.trace.setSpan(context.active(), parentSpan);
		const childSpan = tracer.startSpan(
			'getCache',
			{
				attributes: { 'code.function': 'getCache' },
			},
			ctx
		);

		childSpan.setAttribute('code.filepath', 'cacheData.js');
		childSpan.end();
	}
	return cache.get(key);
};

const setCache = (key, data, cacheTime, parentSpan) => {
	if (!TEST) {
		const ctx = opentelemetry.trace.setSpan(context.active(), parentSpan);
		const childSpan = tracer.startSpan(
			'setCache',
			{
				attributes: { 'code.function': 'setCache' },
			},
			ctx
		);

		childSpan.setAttribute('code.filepath', 'cacheData.js');
		childSpan.end();
	}
	cache.put(key, data, cacheTime);
};

export { getCache, setCache };
