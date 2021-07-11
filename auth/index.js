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

  await axios
    .post(tokenURL, data)
    .then(async (response) => {
      token = response.data;
      await broadcastEvent('TokenObtained');
    })
    .catch((error) => {
      console.log(error.response.data);
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

  await axios
    .post(tokenURL, data)
    .then(async (response) => {
      token = response.data;
      await broadcastEvent('TokenRefreshed');
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  return access_token;
};

const broadcastEvent = async (type) => {
  await axios
    .post('http://event-bus-srv:3000/event-bus/events', {
      type: type,
      data: {},
    })
    .catch((error) => {
      console.log(error.response.data);
    });
};

app.post('/auth/events', (req, res) => {
  const { type, data } = req.body;
  console.log('Received', type, 'event');
  res.send({});
});

app.post('/auth/token', async (req, res) => {
  const { tempCode } = req.body;
  await getNewToken(tempCode);
  res.send({ token: token.access_token });
});

app.get('/auth/token', (req, res) => {
  if (!token.access_token) {
    res.send('no token');
  } else {
    tokenExpired = isTokenExpired(token.expires_at);

    if (tokenExpired) {
      refreshToken();
    }

    res.send({ token: token.access_token });
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
