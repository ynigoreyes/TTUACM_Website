const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const path = require('path');

module.exports.getEvents = (req, res) => {
  // If modifying these scopes, delete credentials.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  const TOKEN_PATH = path.resolve(__dirname, 'credentials.json');

  // Load client secrets from a local file.
  try {
    const content = fs.readFileSync(path.resolve(__dirname, 'client_secret.json'));
    authorize(JSON.parse(content), listEvents);
  } catch (err) {
    return console.log('Error loading client secret file:', err);
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   * @return {function} if error in reading credentials.json asks for a new one.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    let token = {};
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
      token = fs.readFileSync(TOKEN_PATH);
    } catch (err) {
      return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    console.log('nut getAccessToken');
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        try {
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
          console.log('Token stored to', TOKEN_PATH);
        } catch (err) {
          console.error(err);
        }
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, { data }) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const events = data.items;
      if (events.length) {
        // Will store all of the events and return
        eventsList = [];

        // Maps all of the numbers to days
        const weekday = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          const end = event.end.dateTime || event.end.date;
          // Event Object
          eventsList.push({
            id: i,
            day: `${weekday[new Date(start).getDay()]}`,
            startTime: start,
            endTime: end,
            title: event.summary || 'N/A',
            location: event.location || 'N/A',
            creator: event.creator.displayName || 'N/A',
            description: event.description || 'N/A'
          });
        });
        // Sends back the event object
        res.json({ events: eventsList });
      } else {
        // Sends back an empty list
        res.json({ events: [] });
      }
    });
  }
};
