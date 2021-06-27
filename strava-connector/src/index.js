const express = require('express');
const bodyparser = require('body-parser');
// import { json } from 'body-parser';
const axios = require('axios');

const app = express();
app.use(bodyparser.json());

const activities = {};

const start = async () => {

  try {
    let config = {
      headers: {
        Authorization: "Bearer 1008b62c9cf9175f697d4f0d967e42a16436f485"
      },
      params: {
        access_token: "1008b62c9cf9175f697d4f0d967e42a16436f485",
        per_page: 200,
        page: 1
      }
    }

    await axios.get('https://www.strava.com/api/v3/activities', config)
      .then((response) => {
        console.log(response);
      });

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

app.get('/test', (req, res) => {
  res.send('test response');
})

start();
