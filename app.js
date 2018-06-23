require('events').EventEmitter.prototype._maxListeners = 100;

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

// Express Routing and App setup
const app = express();

// Where the views will be
app.use(express.static(path.join(__dirname, 'public')));
require('dotenv').config({ path: path.join(__dirname, '/.env') });

// Production/Development Set up
if (process.env.NODE_ENV === 'prod') {
  console.log('Running in production');
  console.log(`Mongo DB Connected using:\n${process.env.db}`);
  // dotenv file placed in root directory during development
  for (const property in process.env) {
    if (process.env.hasOwnProperty(property)) {
      console.log(`${property}: ${process.env[property]}\n`);
    }
  }
  connectDB();
  nmconfig.generateProdTransporter();
} else {
  connectDB();
  nmconfig.generateTestTransporter();
}

if (process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
} else if (process.env.NODE_ENV !== 'test') {
  require('./config/oauth2.config');
}

/**
 * Connects to the testing db in Mongo Atlas
 */
function connectDB() {
  mongoose.connect(
    process.env.db,
    {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    }
  );
  mongoose.connection.on('error', (err) => {
    console.log(`Error Connecting to database... \n${err}`);
    process.exit(1);
  });
}

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: true }));

// Routes
const usersRoute = require('./routes/user.router');
const eventsRoute = require('./routes/event.router');
const authRoute = require('./routes/auth.router');

app.use('/api/users', usersRoute);
app.use('/api/events', eventsRoute);
app.use('/api/auth', authRoute);

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
