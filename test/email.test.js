import request from 'supertest';
import app from '../src/config/app';

describe('Email Validation', () => {
	test('First Name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: 'Test',
			email: 'test@test.com',
			body: 'test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('First Name is required');
	});

	test('Last Name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: '',
			email: 'test@test.com',
			body: 'test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Last Name is required');
	});

	test('Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: 'Test',
			email: '',
			body: 'test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Email is required');
	});

	test('Body missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: 'Test',
			email: 'test@test.com',
			body: '',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Body is required');
	});

	test('First and Last name missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: '',
			email: 'test@test.com',
			body: 'Test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toHaveLength(2);
		expect(res.body.message[0].msg).toEqual('First Name is required');
		expect(res.body.message[1].msg).toEqual('Last Name is required');
	});

	test('First name and Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: '',
			lastName: 'Test',
			email: '',
			body: 'Test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toHaveLength(2);
		expect(res.body.message[0].msg).toEqual('First Name is required');
		expect(res.body.message[1].msg).toEqual('Email is required');
	});

	test('Last name and Email missing', async () => {
		const res = await request(app).post('/api/send').send({
			firstName: 'Test',
			lastName: '',
			email: '',
			body: 'Test',
		});
		expect(res.status).toEqual(400);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toHaveLength(2);
		expect(res.body.message[0].msg).toEqual('Last Name is required');
		expect(res.body.message[1].msg).toEqual('Email is required');
	});

	// test('Email has send successfully', async () => {
	// 	const res = await request(app).post('/api/send').send({
	// 		firstName: 'Test',
	// 		lastName: 'Test',
	// 		email: 'test@test.com',
	// 		body: 'Test',
	// 	});
	// 	expect(res.status).toEqual(200);
	// 	expect(res.body).toHaveProperty('message');
	// 	expect(res.body.message).toEqual('Email sent.');
	// });
});
