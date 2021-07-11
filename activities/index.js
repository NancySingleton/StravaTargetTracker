const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let activities = {};

app.post('/activities/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Received', type, 'event');
  await handleEvent(type, data);
  res.send({});
});

const handleEvent = async (type, data) => {
  if (type === 'BacklogObtained') {
    for (activityId in data.activities) {
      activities[activityId] = data.activities[activityId];
    }
  }
};

app.get('/activities', (req, res) => {
  res.send(activities);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
