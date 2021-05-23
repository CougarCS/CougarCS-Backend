import { Cache } from 'memory-cache';

const singletonCache = new Cache();

Object.freeze(singletonCache);

export default singletonCache;
