import cache from './cache';

const getCache = (key) => {
	return cache.get(key);
};

const setCache = (key, data, cacheTime) => {
	cache.put(key, data, cacheTime);
};

export { getCache, setCache };
