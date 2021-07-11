const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let subscriptionUrl = 'https://www.strava.com/api/v3/push_subscriptions';

app.post('/activity-listener/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Received', type, 'event');

  res.send({});
});

const subscribe = async () => {
  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    callback_url: process.env.GC_IP + 'activity-listener/',
    verify_token: 123,
  };

  await axios
    .post(subscriptionUrl, data)
    .then(async (response) => {
      console.log('ok');
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

const broadcastEvent = async (type, data) => {
  await axios
    .post('http://event-bus-srv:3000/event-bus/events', {
      type: type,
      data: data,
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

app.get('/activity-listener/', (req, res) => {
  let { 'hub.challenge': hub_challenge } = req.query;
  let body = { 'hub.challenge': hub_challenge };
  res.send(body, 200);
});

app.post('/activity-listener/', (req, res) => {
  broadcastEvent('ActivityRecieved', { activityId: req.body.objectId });
  console.log({ activityId: req.body.object_id });
  res.send('ok', 200);
});

const start = async () => {
  await subscribe();

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
