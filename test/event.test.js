import request from 'supertest';
import app from '../src/config/app';
import apiCall from '../src/utils/api/calls';
import mockEvent from './resources/mockEvent.json';
import redis from '../src/utils/cache';

describe('Get events from google calander', () => {
	let agent;

	beforeEach(() => {
		agent = request(app);
		redis.flushall();
	});

	afterAll(async () => {
		redis.disconnect(false);
		await redis.quit();
	});

	test('Get events', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(
			() => mockEvent
		);

		const res = await agent.get('/api/events');
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('futureEvents');
		expect(res.body).toHaveProperty('pastEvents');
	});

	test('Get events from cache', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(
			() => mockEvent
		);
		await agent.get('/api/events');
		const res = await agent.get('/api/events');
		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('futureEvents');
		expect(res.body).toHaveProperty('pastEvents');
	});

	test('Get events failure', async () => {
		jest.spyOn(apiCall, 'getEvents').mockImplementationOnce(() => {
			throw new Error('Unable to get events');
		});

		const res = await agent.get('/api/events');
		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toEqual('Unable to get events');
	});
});
