// const express = require('express');
// const router = express.Router();
// const readline = require('readline');
// const { check, validationResult } = require('express-validator/check');
// const fs = require('fs');
// const { google } = require('googleapis');
// const config = require('config');

// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// const TOKEN_PATH = 'token.json';

// const getAccessToken = (oAuth2Client) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       listEvents(oAuth2Client);
//     });
//   });
// };
// const setItems = (res) => {
//   const events = res;
// };
// const listEvents = (auth) => {
//   const calendar = google.calendar({ version: 'v3', auth });
//   calendar.events.list(
//     {
//       calendarId: 'primary',
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime'
//     },
//     (err, res) => {
//       if (err) return console.log('The API returned an error: ' + err);
//       return res.data.items;
//     }
//   );
// };
// // @route   GET api/event
// // @desc    Get all events
// // @access  Public
// router.get('/', (req, res) => {
//   const client_secret = config.get('CLIENT_SECRET');
//   const client_id = config.get('CLIENT_ID');
//   const redirect_uris = config.get('REDIRECT_URIS');
//   const oAuth2Client = new google.auth.OAuth2(
//     client_id,
//     client_secret,
//     redirect_uris
//   );

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     const events = listEvents(oAuth2Client);
//     console.log(events);
//   });
// });

// // @route   GET api/event/:event_id
// // @desc    Get a event
// // @access  Public

// module.exports = router;
