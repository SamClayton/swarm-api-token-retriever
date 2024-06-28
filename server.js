const express = require('express');
const app = express();
const querystring = require('querystring');
const axios = require('axios');

const CLIENT_ID = process.env.foursquare_id;
const CLIENT_SECRET = process.env.foursquare_secret3;
const REDIRECT_URI = 'https://swarm-api-token-retriever.glitch.me/callback';

app.get('/', (req, res) => {
  const authUrl = `https://foursquare.com/oauth2/authenticate?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
  res.send(`<a href="${authUrl}">Login with Foursquare</a>`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.send('No code received');
  }

  try {
    console.log(`${CLIENT_ID}\n${CLIENT_SECRET}\n${REDIRECT_URI}\n${code}`)
    const tokenResponse = await axios.get('https://foursquare.com/oauth2/access_token', {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
      }
    });
    
    console.log(`Response: ${JSON.stringify(tokenResponse.data)}`);
    const accessToken = tokenResponse.data.access_token;
    res.send(`Access Token: ${accessToken}`);
  } catch (error) {
    // res.send(`Error getting access token: ${error.response ? error.response.data : error.message}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.send(`Error getting access token: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      res.send(`Error getting access token: No response received`);
    } else {
      // Something happened in setting up the request that triggered an Error
      res.send(`Error getting access token during setup: ${error.message}`);
    }
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
