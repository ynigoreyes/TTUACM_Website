const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');

const configDB = require('./config/database.js');

// Express Routing and App setup
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Now using MongoClient
mongoose.connect(configDB.url, {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database at ' + configDB.url);
});
mongoose.connection.on('error', (err) => {
  console.log('Error Connecting to database ' + err);
});
require('./config/passport')(passport);



// Passport setup
app.use(session({
  secret: "***REMOVED***",
  // Figure out what this means: Updated to get rid of deprecation
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/users', usersRoute);
app.use('/events', eventsRoute);

// Catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // Grabs the environment varibale 'env'
  // If it is development, then we are in dev mode, else: error is not recorded
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // TODO: Make an error page to render that is not in .jade
  res.status(err.status || 500);
  // res.render('error');
  // Do something like this instead
  // res.redirect('/error');
  res.status(404).send('<h1>Not Found</h1>');
});

module.exports = app;
