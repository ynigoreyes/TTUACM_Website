const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
// console.log(TOKEN_PATH);

exports.googleAuthenticate = (req, res, next) => {


  // Load client secrets from a local file.
  fs.readFile('../config/client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });
};

// Google API methods

/**
  * Create an OAuth2 client with the given credentials, and then execute the
  * given callback function.
  *
  * @param {Object} credentials The authorization client credentials.
  * @param {function} callback The callback to call with the authorized client.
  */
function authorize(credentials, callback) {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const auth = new GoogleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
  * Lists the next 10 events on the user's primary calendar.
  *
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  */
function listEvents(auth) {
  const calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function (err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const events = response.items;

    // TODO: Render these templates in Angular
    if (events.length === 0) {
      res.render('events', { title: 'Association for Computing Machinery at Texas Tech University', isEvents: false, isLoggedIn: req.isAuthenticated() });
    } else {
      res.render('events', { title: 'Association for Computing Machinery at Texas Tech University', isEvents: true, calendarEvent: events, isLoggedIn: req.isAuthenticated() });
    }
  });
}


/**
  * Get and store new token after prompting for user authorization, and then
  * execute the given callback with the authorized OAuth2 client.
  *
  * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
  * @param {getEventsCallback} callback The callback to call with the authorized
  *     client.
  */
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function (code) {
    rl.close();
    oauth2Client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        getNewToken(oauth2Client, callback);
      } else {
        const creds = JSON.parse(token);
        oauth2Client.credentials = creds;
        let isTokenExpired = function (creds) {
          if ((creds.expiry_date <= new Date().getTime()) || !creds.expiry_date) {
            console.log("Token Expired or does not exist.");
            return true;
          }
          else return false;
        };
        if (isTokenExpired) oauth2Client.refreshAccessToken(function (err) {
          if (err) console.log(err);
          else isTokenExpired = false;
        });
        callback(oauth2Client);
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}