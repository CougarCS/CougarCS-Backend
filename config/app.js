import cors from 'cors';
import 'dotenv/config';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import admin from '../routes/api/admin';
import auth from '../routes/api/auth';
import email from '../routes/api/email';
import member from '../routes/api/member';
import officer from '../routes/api/officer';
import payment from '../routes/api/payment';
import profile from '../routes/api/profile';
import resume from '../routes/api/resume';

process.env.AWS_BUCKET_NAME = process.env.NODE_ENV === 'test' ? process.env.AWS_BUCKET_NAME_TEST : process.env.AWS_BUCKET_NAME;

const app = express();
app.use(cors());
app.use(morgan('common'));
app.use(helmet());
app.use(json({ extended: false }));

app.get('/', (req, res) => {
  res.json({ welcome: 'CougarCS Backend 🐯' });
});
app.use('/api/admin', admin);
app.use('/api/auth', auth);
app.use('/api/member', member);
app.use('/api/officers', officer);
app.use('/api/profile', profile);
app.use('/api/resume', resume);
app.use('/api/payment', payment);
app.use('/api/send', email);
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

export default app;
