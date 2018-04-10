// TODO: Add CORS handling

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');

var configDB = require('./config/database.js');

// Express Routing and App setup
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
const users = require('./routes/users');
const events = require('./routes/events');


mongoose.connect(configDB.url);
require('./config/passport')(passport);

// Passport setup
app.use(session({secret: '***REMOVED***'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(cookieParser());

// Routes
// require('./routes/index')(app, passport);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', users);
app.use('/events', events);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // TODO: Make an error page to render that is not in .jade
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
