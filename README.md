### CougarCS Backend

Offical backend of CougarCS.
<br/>

<hr/>
<br/>

![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/CougarCS/CougarCS-Backend?style=for-the-badge)
![Coverage](https://img.shields.io/coveralls/github/CougarCS/CougarCS-Backend/master?style=for-the-badge)

# Libraries

- Email : [SendGrid](https://sendgrid.com)
- Payment : [Stripe](https://stripe.com/docs)
- Request : [Axios](https://github.com/axios/axios)
- Linting: [ESLint](https://eslint.org/)
- Testing: [Jest](https://jestjs.io/)

# Getting Started

- ## Requirements
  - [NodeJS](https://nodejs.org/en/) version 12+
  - We use [Yarn](https://yarnpkg.com/getting-started/install) as our package manager
- ## Installation
  - Install dependencies: `yarn`
  - Start local server: `yarn server`
  - The local server will start on [http://localhost:4000](http://localhost:4000)
- ## ENV Setup:
  - If you want to test out the payment or the reCAPTCHA, create a `.env` file in the root project folder. 
  - You must have a [Stripe](https://stripe.com/), [Google's reCAPTCHA](https://www.google.com/recaptcha/about/), and [SendGrid](https://sendgrid.com) accounts.
  - In the `.env` file include these:
  ```
    SENDGRID_API_KEY
    CALENDAR_ID
    CALENDAR_API_KEY
    SHEET_API
    RECAPTCHA_SECRET_KEY
    STRIPE_API_KEY
    SENTRY_URL
    SEND_EMAIL
    INGESTION_KEY
    NOTION_TOKEN
    NOTION_TUTOR_DB
    COUGARCS_CLOUD_URL
    COUGARCS_CLOUD_ACCESS_KEY
    COUGARCS_CLOUD_SECRET_KEY
  ```
  - Reach out to the Webmaster(webmaster@cougarcs.com) for the env values
- ## Linting

  - We use ESLint to fix styling and to enforce rules.
  - Run `yarn run eslint-check` to check linting issues in the code.
  - Run `yarn run eslint-fix` to auto-lint the code.
  - ESLint runs on Github Action. ESLint must pass before pushing or during a pull request.

- ## Testing

  - We use [Jest](https://jestjs.io/) to do Unit testing.
  - We use [Supertest](https://github.com/visionmedia/supertest) to do intergeration test.
  - To run the tests locally:
    - Run `yarn test`
  - To test the coverage of the code:
    - Run `yarn test:coverage`
  - The tests are part of the CI/CD pipeline, if the test fails the CI/CD fails
  - The test coverage has to be 90% or greater and the coverage cannot drop below 5% for a PR or a push.
  - We use [Coveralls](https://coveralls.io/github/CougarCS/CougarCS-Backend) to track the coverage.

- ## Project Structure
  - `server.js` is the starting point of the application
  - `src/api/routes/` has the routes of the applications
  - `src/config/app.js` sets up the middlewares
  - `src/utils/api/calls.js` has the api logic
  - `src/utils/` has config for logger and [Prometheus](https://prometheus.io/)
  - `test` has the unit and the intergeration test
