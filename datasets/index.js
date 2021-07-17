const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let distanceByDate = {};

app.post('/datasets/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Received', type, 'event');
  await handleEvent(type, data);
  res.send({});
});

const handleEvent = async (type, data) => {
  if (type === 'ActivityListUpdatedActivity') {
    let { id, start_date_local, distance } = data;

    distanceByDate[id] = {
      start_date_local: start_date_local,
      distance: distance,
    };
  }
};

const formatDistanceByDate = () => {
  let formattedDistanceByDate = { labels: [], data: [] };
  for (id in distanceByDate) {
    let startDate = formatDate(distanceByDate[id].start_date_local);
    let distance = formatDistance(distanceByDate[id].distance);
    formattedDistanceByDate.labels.push(startDate);
    formattedDistanceByDate.data.push(distance);
  }
  return formattedDistanceByDate;
};

const formatDate = (dateString) => {
  let formattedDateString = dateString.substring(0, 10);
  formattedDate = Date.parse(formattedDateString);
  return formattedDate;
};

const formatDistance = (distance) => {
  let formattedDistance = distance / 1000;
  return formattedDistance;
};
app.get('/datasets/distance-by-date', (req, res) => {
  let formattedDistanceByDate = formatDistanceByDate(distanceByDate);
  res.send(formattedDistanceByDate);
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
