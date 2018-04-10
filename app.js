<<<<<<< HEAD
=======
require('dotenv').config();
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');

<<<<<<< HEAD
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');

=======
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b
const configDB = require('./config/database.js');

// Express Routing and App setup
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
<<<<<<< HEAD

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
  secret: "Texas-Tech-ACM-is-the-best",
  // Figure out what this means: Updated to get rid of deprecation
  resave: false,
  saveUninitialized: true
}));
=======
const users = require('./routes/users');
const events = require('./routes/events');


mongoose.connect(configDB.url);
require('./config/passport')(passport);

// Passport setup
app.use(session({secret: process.env.TTU_ACM_SECRET}));
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

<<<<<<< HEAD

=======
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
<<<<<<< HEAD
app.use('/users', usersRoute);
app.use('/events', eventsRoute);
=======
app.use('/users', users);
app.use('/events', events);
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b

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
<<<<<<< HEAD
  // res.render('error');
  // Do something like this instead
  // res.redirect('/error');
  res.status(404).send('<h1>Not Found</h1>');
=======
  res.render('error');
  // Do something like this instead
  // res.redirect('/error');
>>>>>>> ac51326f44e71d1807be70fed37f53834bce3e8b
});

module.exports = app;
