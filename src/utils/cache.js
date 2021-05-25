import { Cache } from 'memory-cache';

const cache = new Cache();

Object.freeze(cache);

export default cache;

// import { createClient } from 'redis';

// const client = createClient(6379);
// client.on('error', (error) => {
//     console.error(error);
// });

// export default client;

// import Redis from 'ioredis';
// import { logger } from './logger';

// const redis = new Redis();

// redis.on('connect', () => {
// 	logger.info(`Redis Client connected`);
// });

// redis.on('error', (error) => {
// 	logger.error(error);
// });

// redis.on('end', () => {
// 	logger.info('Redis Connection closed');
// });

// export default redis;
