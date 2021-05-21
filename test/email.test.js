import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../src/config/app';

describe('Email Validation', () => {
	it('First Name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: 'Test',
			email: 'test@test.com',
			body: 'test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message[0].msg).to.equal('First Name is required');
	});

	it('Last Name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: '',
			email: 'test@test.com',
			body: 'test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message[0].msg).to.equal('Last Name is required');
	});

	it('Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: 'Test',
			email: '',
			body: 'test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message[0].msg).to.equal('Email is required');
	});

	it('Body missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: 'Test',
			email: 'test@test.com',
			body: '',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message[0].msg).to.equal('Body is required');
	});

	it('First and Last name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: '',
			email: 'test@test.com',
			body: 'Test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message).to.have.lengthOf(2);
		expect(res.body.message[0].msg).to.equal('First Name is required');
		expect(res.body.message[1].msg).to.equal('Last Name is required');
	});

	it('First name and Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: 'Test',
			email: '',
			body: 'Test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message).to.have.lengthOf(2);
		expect(res.body.message[0].msg).to.equal('First Name is required');
		expect(res.body.message[1].msg).to.equal('Email is required');
	});

	it('Last name and Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: '',
			email: '',
			body: 'Test',
		});
		expect(res.status).to.equal(400);
		expect(res.body).to.have.property('message');
		expect(res.body.message).to.have.lengthOf(2);
		expect(res.body.message[0].msg).to.equal('Last Name is required');
		expect(res.body.message[1].msg).to.equal('Email is required');
	});

	it('Email has send successfully', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: 'Test',
			email: 'test@test.com',
			body: 'Test',
		});
		expect(res.status).to.equal(200);
		expect(res.body).to.have.property('message');
		expect(res.body.message).to.equal('Email sent.');
	});
});
