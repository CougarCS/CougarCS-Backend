export const {
	PORT = 4000,
	NODE_ENV = 'dev',
	SENDGRID_API_KEY = 'test',
	CALENDAR_ID = 'test',
	CALENDAR_API_KEY = 'test',
	SHEET_API = 'test',
	RECAPTCHA_SECRET_KEY = 'test',
	STRIPE_API_KEY = 'test',
	SENTRY_URL = '',
	SEND_EMAIL = 'test@test.com',
} = process.env;

export const CACHE_TIME = NODE_ENV === 'test' ? 30 : 60 * 60 * 4; // 4 hour
export const ENABLE_CORS = NODE_ENV !== 'dev' || NODE_ENV !== 'test';
