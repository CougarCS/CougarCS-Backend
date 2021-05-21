import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/config/app';

describe('CougarCS Backend Home API', () => {
	it('GET /', async () => {
		const res = await request(app).get('/');
		expect(res.status).to.equal(200);
		expect(res.body).to.be.an.instanceof(Object);
		expect(res.body).to.have.key('welcome');
		expect(res.body.welcome).to.be.equal('CougarCS Backend 🐯');
	});
});
