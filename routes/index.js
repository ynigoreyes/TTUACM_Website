module.exports = function(app, passport) {

    /* GET home page. */
    app.get('/', function(req, res, next) {
      res.render('index', { title: 'Association for Computing Machinery at Texas Tech University', isLoggedIn: req.isAuthenticated()});
    });

    /* GET events page. */
    app.get('/events', function(req, res, next) {
      var fs = require('fs');
      var readline = require('readline');
      var google = require('googleapis');
      var googleAuth = require('google-auth-library');

      // If modifying these scopes, delete your previously saved credentials
      // at ~/.credentials/calendar-nodejs-quickstart.json
      var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
      var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
          process.env.USERPROFILE) + '/.credentials/';
      var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
      console.log(TOKEN_PATH);

      // Load client secrets from a local file.
      fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
          console.log('Error loading client secret file: ' + err);
          return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        authorize(JSON.parse(content), listEvents);
      });

      /**
       * Create an OAuth2 client with the given credentials, and then execute the
       * given callback function.
       *
       * @param {Object} credentials The authorization client credentials.
       * @param {function} callback The callback to call with the authorized client.
       */
      function authorize(credentials, callback) {
        var clientSecret = credentials.web.client_secret;
        var clientId = credentials.web.client_id;
        var redirectUrl = credentials.web.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
          if (err) {
            getNewToken(oauth2Client, callback);
          } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
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
        var authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
          rl.close();
          oauth2Client.getToken(code, function(err, token) {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
          });
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
          if (err.code != 'EEXIST') {
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
        var calendar = google.calendar('v3');
        calendar.events.list({
          auth: auth,
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
          var events = response.items;
          if (events.length == 0) {
            res.render('events', { title: 'Association for Computing Machinery at Texas Tech University', isEvents: false, isLoggedIn: req.isAuthenticated()});
          } else {
            res.render('events', { title: 'Association for Computing Machinery at Texas Tech University', isEvents: true, calendarEvent: events, isLoggedIn: req.isAuthenticated()});
          }
        });
      }
    });

    /* GET team page. */
    app.get('/team', function(req, res, next) {
      var fs = require('fs');
      fs.readFile('team.json', (err, data) => {
          if (err) {
              console.log('File Error: ' + err);
          }
      var team = JSON.parse(data);
      res.render('team', { title: 'Association for Computing Machinery at Texas Tech University', teamMembers: team, isLoggedIn: req.isAuthenticated()});
      });
    });

    /* GET contact page. */
    app.get('/contact', function(req, res, next) {
      res.render('contact', { title: 'Association for Computing Machinery at Texas Tech University', isLoggedIn: req.isAuthenticated()});
    });

    /* GET login page */
    app.get('/login', function(req, res, next) {
        res.render('login', {title: 'Association for Computing Machinery at Texas Tech University', message: req.flash('loginMessage'), isLoggedIn: req.isAuthenticated() });
    });

    /* POST login page */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    /* GET logout page*/
    app.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });

    /* GET signup page */
    app.get('/signup', function(req, res, next) {
        res.render('signup', {title: 'Association for Computing Machinery at Texas Tech University', message: req.flash('signupMessage'), isLoggedIn: req.isAuthenticated()});
    });

    /* POST signup page */
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

};
