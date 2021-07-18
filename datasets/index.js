const express = require('express');
const bodyParser = require('body-parser');
const dayjs = require('dayjs');

const app = express();
app.use(bodyParser.json());

let activityData = {};

/* Event Listener */
app.post('/datasets/events', async (req, res) => {
  const { type, data } = req.body;
  console.log('Received', type, 'event');
  await handleEvent(type, data);
  res.send({});
});

const handleEvent = async (type, data) => {
  if (type === 'ActivityListUpdatedActivity') {
    let { id, start_date_local, distance } = data;

    activityData[id] = {
      start_date_local: start_date_local,
      distance: distance,
    };
  }
};

/* Distance By Date Dataset */
app.get('/datasets/distance-by-date', (req, res) => {
  let dataset = distanceByDate(activityData);
  res.send(dataset);
});

const distanceByDate = (data) => {
  let unsortedArray = [];

  for (activityId in data) {
    let datapoint = {
      start_date_local: dayjs(data[activityId].start_date_local),
      distance: data[activityId].distance / 1000,
    };
    unsortedArray.push(datapoint);
  }

  let sortedArray = unsortedArray.sort(
    (a, b) => a.start_date_local - b.start_date_local
  );

  let result = { labels: [], data: [] };

  for (datapoint of sortedArray) {
    result.labels.push(dayjs(datapoint.start_date_local).format('DD/MM/YYYY'));
    result.data.push(datapoint.distance);
  }

  return result;
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
