/* eslint-disable */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.resolve(__dirname, 'credentials.json');

function loadCredentials() {
  return new Promise(async (resolve) => {
    // Load client secrets from a local file.
    try {
      console.log('Grabbing Google API credentials...');
      const content = fs.readFileSync(path.resolve(__dirname, 'client_secret.json'));
      await authorize(JSON.parse(content));
      // Creates a calendar to be used in the controller
      await require('../controllers/event.controller').createCalendar();
      resolve()
    } catch (err) {
      console.log('Error loading client secret file:', err);
      process.exit(1);
    }
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
function authorize(credentials) {
  return new Promise(async (resolve, reject) => {
    // Gets the information out of the token
    let token = {};
    let oAuth2Client;
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
      token = fs.readFileSync(TOKEN_PATH);
    } catch (err) {
      oAuth2Client = await getAccessToken(oAuth2Client);
    }
    if (oAuth2Client === null) reject(new Error('Cannot get credentials for OAuth2 Client'));
    oAuth2Client.setCredentials(JSON.parse(token));
    global.oAuth2Client = oAuth2Client;
    resolve(oAuth2Client);
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) reject(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        try {
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
          console.log('Token stored to', TOKEN_PATH);
        } catch (err) {
          console.error(err);
          reject(err);
        }
        resolve(oAuth2Client);
      });
    });
  });
}

module.exports = {
  loadCredentials,
  authorize
};
