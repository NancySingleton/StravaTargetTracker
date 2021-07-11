const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const activitiesURL = 'https://www.strava.com/api/v3/activities/';
let token = '';
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
  } else if (type === 'ActivityReceived') {
    await refreshActivity(data.activityId);
  }
};

const getToken = async () => {
  await axios
    .get('http://auth-srv:3000/auth/token')
    .then((response) => {
      token = response.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

const refreshActivity = async (activityId) => {
  await getToken();
  let config = {
    headers: {
      Authorization: 'Bearer ' + token.token,
    },
    params: { include_all_efforts: true },
  };

  await axios
    .get(activitiesURL + activityId, config)
    .then((response) => {
      let {
        id,
        name,
        distance,
        moving_time,
        elapsed_time,
        type,
        start_date_local,
        kudos_count,
      } = response.data;
      let activity = {
        id: id,
        name: name,
        distance: distance,
        moving_time: moving_time,
        elapsed_time: elapsed_time,
        type: type,
        start_date_local: start_date_local,
        kudos_count: kudos_count,
      };
      console.log(activities);
      activities[id] = activity;
      console.log(activities);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

app.get('/activities', (req, res) => {
  res.send(activities);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
