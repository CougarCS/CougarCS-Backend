import request from 'supertest';
import app from '../src/config/app';

describe('Backend Home API', () => {
	test('GET /', async () => {
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Object);
		expect(res.body).toHaveProperty('welcome');
		expect(res.body.welcome).toBe('CougarCS Backend 🐯');
	});

	test('Invalid GET endpoint should throw error', async () => {
		const res = await request(app).get('/invaild');

		expect(res.status).toBe(500);
		expect(res.body).toBeInstanceOf(Object);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Invaild Request - Endpoint: /invaild');
	});

	test('Invalid POST endpoint should throw error', async () => {
		const res = await request(app).post('/invaild').send({
			test: 'test',
		});

		expect(res.status).toBe(500);
		expect(res.body).toBeInstanceOf(Object);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toBe('Invaild Request - Endpoint: /invaild');
	});
});
