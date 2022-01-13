import request from 'supertest';
import app from '../src/config/app';
import apiCall from '../src/utils/api/calls';
import mockVideos from './resources/mockVideos.json';
import cache from '../src/utils/caching/cache';

describe('Get videos from YouTube', () => {
	let agent;

	beforeEach(() => {
		agent = request(app);
		cache.clear();
	});

	afterAll(async () => {
		cache.clear();
	});

	test('Get videos', async () => {
		jest.spyOn(apiCall, 'getYoutubeVideos').mockImplementationOnce(
			() => mockVideos
		);

		const res = await agent.get('/api/youtube');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('videos');
	});

	test('Get videos from cache', async () => {
		jest.spyOn(apiCall, 'getYoutubeVideos').mockImplementationOnce(
			() => mockVideos
		);
		await agent.get('/api/youtube');
		const res = await agent.get('/api/youtube');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('videos');
	});

	test('Get videos failure', async () => {
		jest.spyOn(apiCall, 'getYoutubeVideos').mockImplementationOnce(() => {
			throw new Error('Unable to get videos');
		});

		const res = await agent.get('/api/youtube');
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Unable to get videos');
	});
});
