import { setCache, getCache } from '../../src/utils/caching/cacheData';

describe('Cache Test', () => {
	test('Set cache and get cache', () => {
		const key = 'test';
		const data = { test: 'test' };
		const cacheTime = 10;

		setCache(key, data, cacheTime);
		const cacheData = getCache(key);

		expect(cacheData).toEqual(data);
	});
});
