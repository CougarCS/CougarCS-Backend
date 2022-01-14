import request from 'supertest';
import app from '../src/config/app';
import apiCall from '../src/utils/api/calls';
import mockEvent from './resources/mockEvent.json';
import cache from '../src/utils/caching/cache';

describe('Get events from google calander', () => {
	let agent;

	beforeEach(() => {
		agent = request(app);
		cache.clear();
	});

	afterAll(async () => {
		cache.clear();
	});

	test('Get events', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(
			() => mockEvent
		);

		const res = await agent.get('/api/events');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('events');
		expect(res.body.events[0]).toHaveProperty('start');
		expect(res.body.events[0]).toHaveProperty('end');
		expect(res.body.events[0]).toHaveProperty('title');
		expect(res.body.events[0]).toHaveProperty('desc');
	});

	test('Get events from cache', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(
			() => mockEvent
		);
		await agent.get('/api/events');
		const res = await agent.get('/api/events');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('events');
		expect(res.body.events[0]).toHaveProperty('start');
		expect(res.body.events[0]).toHaveProperty('end');
		expect(res.body.events[0]).toHaveProperty('title');
		expect(res.body.events[0]).toHaveProperty('desc');
	});

	test('Get events failure', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(() => {
			throw new Error('Unable to get events');
		});

		const res = await agent.get('/api/events');
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Unable to get events');
	});
});
