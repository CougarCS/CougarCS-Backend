import request from 'supertest';
import app from '../src/config/app';

describe('Backend Home API', () => {
	it('GET /', async () => {
		const res = await request(app).get('/');
		expect(res.status).toEqual(200);
		expect(res.body).toBeInstanceOf(Object);
		expect(res.body).toHaveProperty('welcome');
		expect(res.body.welcome).toEqual('CougarCS Backend 🐯');
	});
});
