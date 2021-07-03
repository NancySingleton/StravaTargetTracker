const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const tokenURL = 'http://www.strava.com/oauth/token';

let token = {
  access_token: '',
  refresh_token: '',
  expires_at: '',
  expires_in: '',
};

const getNewToken = async (tempCode) => {
  let data = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: tempCode,
    grant_type: 'authorization_code',
  };

  await axios.post(tokenURL, data).then((response) => {
    token = response.data;
  });
};

const isTokenExpired = (expiryDate) => {
  var secondsSinceEpoch = Math.floor(new Date() / 1000);
  if (secondsSinceEpoch > expiryDate) {
    return true;
  } else {
    return false;
  }
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

app.get('/auth/test', (req, res) => {
  res.send('test response');
});

app.post('/auth/token', async (req, res) => {
  const { tempCode } = req.body;
  await getNewToken(tempCode);
  res.send(token.access_token);
});

app.get('/auth/token', (req, res) => {
  if (!token.access_token) {
    res.send('no token');
  } else {
    tokenExpired = isTokenExpired(token.expires_at);

    if (tokenExpired) {
      refreshToken();
    }

    res.send(token.access_token);
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
