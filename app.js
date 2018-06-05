const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const nmconfig = require('./config/nodemailer-transporter');

mongoose.Promise = global.Promise;

// dotenv file placed in root directory during development
require('dotenv').config({ path: path.join(__dirname, '/.env') });

// Express Routing and App setup
const app = express();


// Where the views will be
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Now using MongoClient
 * Connected to a local replica of Mongo so that we can store data
 * and see how it looks like without connecting to our actual database
 */
mongoose.connect(process.env.db, {
  useMongoClient: true,
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30
});
mongoose.connection.on('connected', () => {
  console.log('Database Connection Successful');
});
mongoose.connection.on('error', (err) => {
  console.log(`Error Connecting to database... \n${err}`);
});

if (process.env.NODE_ENV === 'production') {
  nmconfig.generateProdTransporter();
} else {
  nmconfig.generateTestTransporter();
}

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * CORS
 *
 * Handles all of the requests from different ports/origins.
 * Development port for Angular is on port 4200 and will throw errors if
 * I change port to 80. CORS is so that I can hit the API from the
 * development port without errors
 */
app.use(cors({origin: true}));

// Routes
const usersRoute = require('./routes/users');
const eventsRoute = require('./routes/events');
const authRoute = require('./routes/auth');

app.use('/users', usersRoute);
app.use('/events', eventsRoute);
app.use('/auth', authRoute);


/**
 * During production, this should redirect everyone that puts
 * in a weird url to the index page. Uncomment when deploying for production
 */

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // Grabs the environment varibale 'env'
  // If it is development, then we are in dev mode, else: error is not recorded
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.redirect(`${req.protocol}://${req.headers.host}/error`);
});

module.exports = app;
