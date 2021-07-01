const express = require('express');
const axios = require('axios');

const app = express();
const tokenURL = 'https://www.strava.com/oauth/token';
let token = {
  access_token: '',
  refresh_token: '',
  expires_at: '',
  expires_in: '',
};

const isTokenExpired = (expiryDate) => {
  var secondsSinceEpoch = Math.floor(new Date() / 1000);
  if (secondsSinceEpoch > expiryDate) {
    return true;
  } else {
    return false;
  }
};

const initialGetToken = async () => {

  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: process.env.TEMP_CODE,
    grant_type: 'authorization_code',
  };

  await axios.post(tokenURL, data).then((response) => {
    token = response.data;
  });
};

const refreshToken = async () => {
  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token,
  };

  await axios.post(tokenURL, data).then((response) => {
    token = response.data;
  });

  return access_token;
};

app.get('/test', (req, res) => {
  res.send('test response');
});

app.get('/token', (req, res) => {
  let tokenExpired = isTokenExpired(token.expires_at);

  if (tokenExpired) {
    refreshToken();
  }

  res.send(token.access_token);
});

const start = () => {
  initialGetToken();

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
};

start();
