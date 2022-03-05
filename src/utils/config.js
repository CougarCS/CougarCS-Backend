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
	NOTION_TOKEN = 'secret',
	NOTION_TUTOR_DB = 'none',
	COUGARCS_CLOUD_URL = '',
	COUGARCS_CLOUD_ACCESS_KEY = '',
	COUGARCS_CLOUD_SECRET_KEY = '',

	JAEGER_URL = '',
	YOUTUBE_PLAYLIST_ID = '',
	YOUTUBE_API_KEY = '',

} = process.env;

export const PROD = NODE_ENV === 'prod';
export const DEV = NODE_ENV === 'dev';
export const TEST = NODE_ENV === 'test';

export const ENABLE_CORS = PROD;
export const CACHE_TIME = PROD ? 1000 * 60 * 60 * 4 : 30 * 1000; // 30secs or 4 hours
export const CCSCLOUD_TOKEN_CACHE_TIME = PROD ? 1000 * 60 * 5 : 1000 * 30;
