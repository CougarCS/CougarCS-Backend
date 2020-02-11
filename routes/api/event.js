import axios from 'axios';
import { Router } from 'express';
import _ from 'lodash';
import moment from 'moment';

const router = new Router();
const renameKey = (obj, oldKey, newKey) => {
  if (oldKey !== newKey && !obj.date) {
    Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey));
    delete obj[oldKey];
  }
};
router.get('/', async (req, res) => {
  const { data } = await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}/events?key=${process.env.CALENDAR_API_KEY}`);
  const now = moment();
  let futureEvents = [];
  let pastEvents = [];

  data.items.map((item) => {
    if (item.start === undefined) {
      return;
    }
    if (item.start.date !== undefined) {
      if (moment(item.start.date) > now) {
        futureEvents.push(item);
      }
      if (moment(item.start.date) < now && moment(item.start.date) > moment().subtract(4, 'months')) { pastEvents.push(item); }
    } else {
      if (moment(item.start.dateTime) > now) {
        futureEvents.push(item);
      }
      if (moment(item.start.dateTime) < now && moment(item.start.dateTime) > moment().subtract(4, 'months')) { pastEvents.push(item); }
    }
  });


  futureEvents.forEach((obj) => renameKey(obj.start, 'dateTime', 'date'));
  futureEvents.forEach((obj) => renameKey(obj.end, 'dateTime', 'date'));
  pastEvents.forEach((obj) => renameKey(obj.start, 'dateTime', 'date'));
  pastEvents.forEach((obj) => renameKey(obj.end, 'dateTime', 'date'));


  futureEvents = _.sortBy(futureEvents, (o) => moment(o.start.date));
  pastEvents = _.sortBy(pastEvents, (o) => moment(o.start.date)).reverse();
  res.send({ futureEvents, pastEvents });
});

export default router;
