const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let activities = {};
let token = '';
const activitiesURL = 'https://www.strava.com/api/v3/activities';

app.post('/activity-backlog/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('got event');
  await handleEvent(type, data);

  res.send({});
});

app.get('/activity-backlog/getall', (req, res) => {
  res.send(activities);
});

const handleEvent = async (type, data) => {
  if (type === 'TokenObtained') {
    await getActivityBacklog();
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

const getActivityBacklog = async () => {
  await getToken();
  let pageNumber = 1;

  while (true) {
    let activityPage = await getPageOfActivities(pageNumber);

    if (!activityPage.length) {
      break;
    } else {
      for (const activity of activityPage) {
        let {
          id,
          name,
          distance,
          moving_time,
          elapsed_time,
          type,
          start_date_local,
          kudos_count,
        } = activity;
        let formattedActivity = {
          id: id,
          name: name,
          distance: distance,
          moving_time: moving_time,
          elapsed_time: elapsed_time,
          type: type,
          start_date_local: start_date_local,
          kudos_count: kudos_count,
        };
        activities[activity.id] = formattedActivity;
      }
    }
    pageNumber += 1;
  }
  broadcastEvent('BacklogObtained');
};

const getPageOfActivities = async (pageNumber) => {
  var activityPage;
  let config = {
    params: {
      access_token: token.token,
      per_page: 200,
      page: pageNumber,
    },
  };

  await axios
    .get(activitiesURL, config)
    .then((response) => {
      activityPage = response.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  return activityPage;
};

const broadcastEvent = (type) => {
  axios.post('http://event-bus-srv:3000/event-bus/events', {
    type: type,
    data: { activities: activities },
  });
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
