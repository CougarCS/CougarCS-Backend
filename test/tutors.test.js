import request from 'supertest';
import app from '../src/config/app';
import apiCall from '../src/utils/api/calls';
import mockTutors from './resources/mockTutors.json';
import cache from '../src/utils/caching/cache';

describe('Get tutors from notion', () => {
	let agent;

	beforeEach(() => {
		agent = request(app);
		cache.clear();
	});

	afterAll(async () => {
		cache.clear();
	});

	test('Get tutors', async () => {
		jest.spyOn(apiCall, 'getTutors').mockImplementationOnce(
			() => mockTutors
		);

		const res = await agent.get('/api/tutors');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('tutors');
	});

	test('Get tutors from cache', async () => {
		jest.spyOn(apiCall, 'getTutors').mockImplementationOnce(
			() => mockTutors
		);
		await agent.get('/api/tutors');
		const res = await agent.get('/api/tutors');
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('tutors');
	});

	test('Get tutors failure', async () => {
		jest.spyOn(apiCall, 'getTutors').mockImplementationOnce(() => {
			throw new Error('Unable to get tutors');
		});

		const res = await agent.get('/api/tutors');
		expect(res.status).toBe(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Unable to get tutors');
	});
});
