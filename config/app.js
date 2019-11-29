import cors from 'cors';
import 'dotenv/config';
import express, { json } from 'express';
import morgan from 'morgan';
import admin from '../routes/api/admin';
import auth from '../routes/api/auth';
import member from '../routes/api/member';
import officer from '../routes/api/officer';
import payment from '../routes/api/payment';
import profile from '../routes/api/profile';
import resume from '../routes/api/resume';

const app = express();
app.use(cors());
app.use(morgan('dev'));
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

export default app;
