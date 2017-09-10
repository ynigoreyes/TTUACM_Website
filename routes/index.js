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
              var creds = JSON.parse(token);
              oauth2Client.credentials = creds;
              var isTokenExpired = function (creds) {
                  if ((creds.expiry_date <= new Date().getTime()) || !creds.expiry_date) {
                      console.log("Token Expired or does not exist.");
                      return true;
                  }
                  else return false;
              }
              if (isTokenExpired) oauth2Client.refreshAccessToken(function(err) {
                  if (err) console.log(err);
                  else isTokenExpired = false;
              });
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

    /* GET profile page */
    app.get('/profile', membersOnly, function(req, res, next) {
        res.render('profile', { title: 'Association for Computing Machinery at Texas Tech University', isLoggedIn: req.isAuthenticated(), user: req.user});
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

    /* GET forgot page */
    app.get('/forgot', function(req, res, next) {
        res.render('forgot', {title: 'Association for Computing Machinery at Texas Tech University', message: req.flash('forgotMessage')});
    });

    /* POST forgot page */
    app.post('/forgot', function(req, res, next) {
        var crypto = require('crypto');
        var nodemailer = require('nodemailer');
        var async = require('async');
        var User = require('../models/user');
        async.waterfall([

            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },

            function(token, done) {
                User.findOne({'local.email': req.body.email}, function(err, user) {
                    if (!user) {
                        req.flash('forgotMessage', 'No account with that email was found.');
                        return res.redirect('/forgot');
                    }
                    user.local.resetPasswordToken = token;
                    user.local.resetPasswordExpires = Date.now() + 10800000 // 3 Hours
                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },

            function(token, user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'acmtexastech@gmail.com',
                        pass: 'w1nnersallofus'
                    }
                });
                var mailOptions = {
                    to: user.local.email,
                    from: 'acmtexastech@gmail.com',
                    subject: 'TTU ACM Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('forgotMessage', 'An email has been sent to ' + user.local.email + ' with a reset link.')
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) return next(err);
            res.redirect('/forgot');
        });
    });

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

    /* GET reset page */
    app.get('/reset/:token', function(req, res) {
        var User = require('../models/user');
        User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': {$gt: Date.now()}}, function(err, user) {
            if (!user) {
                req.flash('forgotMessage', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {user: req.user, message: req.flash('resetMessage')});
        });
    });

    /* POST reset page */
    app.post('/reset/:token', function(req, res, next) {
        var nodemailer = require('nodemailer');
        var async = require('async');
        var User = require('../models/user');
        async.waterfall([
            function(done) {
                User.findOne({'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': {$gt: Date.now()}}, function(err, user) {
                    if (!user) req.flash('resetMessage', 'Password reset link is invalid or expired.');
                    else if (req.body.password !== req.body.confirmPassword) {
                        req.flash('forgotMessage', 'Password and confirm password must match.');
                        return res.redirect('/forgot');
                    } else {
                        user.local.password = req.body.password;
                        user.local.resetPasswordToken = undefined;
                        user.local.resetPasswordExpires = undefined;

                        user.save(function(err) {
                            req.logIn(user, function(err) {
                                done(err, user);
                            });
                        });
                    }
                });
            },
            function(user, done) {
                var smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'acmtexastech@gmail.com',
                        pass: 'w1nnersallofus'
                    }
                });
                var mailOptions = {
                    to: user.local.email,
                    from: 'acmtexastech@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account has been changed.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('resetMessage', 'Your password has been changed.');
                    done(err);
                })
            }
        ], function(err) {
            res.redirect('/');
        });
    });

};

// Place this function in the parameters of pages that only members should have access to
function membersOnly(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}
