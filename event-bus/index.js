const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
});

app.post('/event-bus/events', (req, res) => {
  const event = req.body;
  console.log('Sending', event.type, 'event');
  events.push(event);

  axios
    .post('http://activity-backlog-srv:3000/activity-backlog/events', event)
    .catch((error) => {
      console.log(error);
    });

  axios
    .post('http://activity-listener-srv:3000/activity-listener/events', event)
    .catch((error) => {
      console.log(error);
    });

  axios.post('http://auth-srv:3000/auth/events', event).catch((error) => {
    console.log(error);
  });

  axios
    .post('http://activities-srv:3000/activities/events', event)
    .catch((error) => {
      console.log(error);
    });

  res.send({ status: 'OK' });
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
