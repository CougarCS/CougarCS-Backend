import request from 'supertest';
import app from '../src/config/app';
import apiCall from '../src/utils/api/calls';

let agent;
beforeEach(async () => {
	agent = request(app);
});

describe('Payment API test', () => {
	test('Missing first name', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: '',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('First Name is required');
	});

	test('Missing last name', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: '',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Last Name is required');
	});

	test('Missing email address', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: '',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Email is required');
	});

	test('Invalid email address', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Email is required');
	});

	test('UHID missing', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('UHID is required');
	});

	test('UHID invalid', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '123',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('UHID is required');
	});

	test('Shirt Size missing', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: '',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Shirt Size is required');
	});

	test('Paid Until missing', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: '',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Paid Until is required');
	});

	test('Phone number missing', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Phone Number is required');
	});

	test('Phone number invalid', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Phone Number is required');
	});

	test('Recaptcha Token Missing', async () => {
		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message[0].msg).toEqual('Recaptcha Token is required');
	});

	test('Recaptcha Testing verification Url Fail', async () => {
		jest.spyOn(apiCall, 'checkRecaptcha').mockImplementationOnce(() => {
			return { data: { success: '' } };
		});

		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toEqual('Failed to validate ReCaptcha');
	});

	test('Stripe payment Fail', async () => {
		jest.spyOn(apiCall, 'checkRecaptcha').mockImplementationOnce(() => {
			return { data: { success: 'Success' } };
		});

		jest.spyOn(apiCall, 'createStripeCustomer').mockImplementationOnce(
			() => {
				throw new Error();
			}
		);

		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(500);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toEqual('Payment Error!');
	});

	test('CCS Cloud Post Contact', async () => {
		jest.spyOn(apiCall, 'checkRecaptcha').mockImplementationOnce(() => {
			return { data: { success: 'Success' } };
		});

		jest.spyOn(apiCall, 'createStripeCustomer').mockImplementationOnce(
			() => true
		);

		jest.spyOn(apiCall, 'postContact').mockImplementationOnce(() => true);

		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '7777777',
				shirtSize: 'M',
				paidUntil: 'semester',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toEqual('OK');
	});

	test('CCS Cloud Post Contact Fail', async () => {
		jest.spyOn(apiCall, 'checkRecaptcha').mockImplementationOnce(() => {
			return { data: { success: 'Success' } };
		});

		jest.spyOn(apiCall, 'createStripeCustomer').mockImplementationOnce(
			() => true
		);

		jest.spyOn(apiCall, 'sendEmail').mockImplementationOnce(() => true);

		jest.spyOn(apiCall, 'postContact').mockImplementationOnce(() => {
			throw new Error();
		});

		const res = await agent.post('/api/payment').send({
			user: {
				firstName: 'Test',
				lastName: 'Test',
				email: 'test@test.com',
				uhID: '1234567',
				shirtSize: 'M',
				paidUntil: 'year',
				phone: '123-456-7890',
			},
			recaptchaToken: '123456abc',
		});

		expect(res.status).toEqual(200);
		expect(res.body).toHaveProperty('message');
		expect(res.body.message).toEqual('OK');
	});
});
