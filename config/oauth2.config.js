/* eslint-disable */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.resolve(__dirname, 'credentials.json');

// Load client secrets from a local file.
try {
  console.log('Grabbing Google API credentials...');
  const content = fs.readFileSync(path.resolve(__dirname, 'client_secret.json'));
  authorize(JSON.parse(content));
} catch (err) {
  console.log('Error loading client secret file:', err);
  process.exit();
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @return {function} if error in reading credentials.json asks for a new one.
 */
async function authorize(credentials) {
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
  oAuth2Client.setCredentials(JSON.parse(token));
  global.oAuth2Client = oAuth2Client;
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
  authorize
};
