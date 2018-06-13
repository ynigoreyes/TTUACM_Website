const User = require('../models/user.model');

const crypto = require('crypto');
const async = require('async');
const jwt = require('jsonwebtoken');

// Bcrypt options
const bcrypt = require('bcryptjs');

const saltRounds = 10;

// Test Login Route for exports.authenticate
function login(req, res) {
  const email = req.body.email;
  const inputPassword = req.body.password;

  // In the test, we are not able to see the email passed
  User.getUserByEmail(email, (err, foundUser) => {
    if (err) {
      console.log(`Error in login sequence function: \n\n${err}`);
      res.status(404).json({
        user: null,
        msg: 'Unknown Error has occured, Please try again later'
      });
    } else if (foundUser !== null && foundUser.password !== null) {
      bcrypt.compare(inputPassword, foundUser.password, (err, response) => {
        if (err) {
          console.log(err);
        }
        if (response) {
          // We don't want to pass back the password at all
          const token = jwt.sign({ data: foundUser }, process.env.session_secret, {
            expiresIn: 604800 // 1 week
          });

          res.status(200).json({
            user: foundUser,
            token: `JWT ${token}`
          });
        } else {
          res.status(401).json({
            user: null,
            msg: 'Invalid Login'
          });
        }
      });
    } else {
      // If the was no user found with that user name
      res.status(404).json({
        user: null,
        msg: 'User Not Found'
      });
    }
  });
}

// Check to see if this works on Postman
function forgotLogin(req, res) {
  async.waterfall(
    [
      // We save the token into the user document along with an expiration date
      function generateTokenAndSave(done) {
        User.findOne({ email: req.body.email }, (err, user) => {
          const currentUser = user;
          // No user was found
          if (currentUser === null) {
            done(new Error('User not found'));
          } else if (err) {
            done(err);
          } else {
            currentUser.resetPasswordToken = token = generateHexToken();
            currentUser.resetPasswordExpires = Date.now() + 3 * 60 * 60 * 1000; // 3 Hours
            currentUser.save((err) => {
              done(err, token, currentUser);
            });
          }
        });
      },

      // Sends the email to the user that requested a password reset
      function sendResetEmail(token, user, done) {
        const mailOptions = {
          to: user.email,
          from: 'Texas Tech ACM',
          subject: 'TTU ACM Password Reset',
          text:
            `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n'}${
              req.protocol
            }://${req.headers.host}/users/reset/${token}\n\n` +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        global.smtpTransporter.sendMail(mailOptions, (err) => {
          res.status(200).json({ recipient: user });
          done(err, 'done');
        });
      }
    ],
    (err) => {
      if (err) {
        console.log(err);
        res.status(404).json({ recipient: null });
      }
    }
  );
}

/**
 * Resets the user password
 *
 * @param {string} req.params.token - HEX Token passed through the URL
 * @param {string} password - new password that will replace the old one
 *
 * @returns {Promise.<null, Error>} - Rejects with an error
 * from verifyUser or sendChangedPasswordEmail
 */
function resetPassword(token, password) {
  return new Promise((resolve, reject) => {
    verifyUser(token, password)
      .then((user) => {
        sendChangedPasswordEmail(user)
          .then(resolve())
          .catch(err => reject(err));
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Verifies the user based on whether or not they pass a valid JWT Token
 *
 * @param {string} token - JWT Token
 * @param {string} passwordAttempt - Attempted password from user
 * @returns {Promise.<object, Error>} - Resolves with user or rejects with
 * an error from bcrypt or finding a document in Mongo
 */
function verifyUser(token, passwordAttempt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(passwordAttempt, saltRounds, (err, hash) => {
      if (err) reject(err);
      User.findOneAndUpdate(
        {
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        },
        {
          // Need to encrypt the password first
          password: hash,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined
        },
        { new: true },
        (err, user) => {
          if (err) reject(err);
          resolve(user);
        }
      );
    });
  });
}

/**
 * Send the notification to the user that informtion in their account has changed
 * @param {string} email User's email
 * @returns {Promise.<null, Error>} Rejects with an error if there is something wrong with the email
 */
function sendChangedPasswordEmail(email) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      to: email,
      from: process.env.email_username,
      subject: 'Your password has been changed',
      text:
        'Hello,\n\n' +
        'This is a confirmation that the password for your account has been changed.\n'
    };
    global.smtpTransporter.sendMail(mailOptions, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

/**
 * Endpoint hit when a user clicks on their confirmation link
 *
 * Compares the url token with the token saved in the database.
 * If thre is a match, the user is verified and redirected to log in
 */
function confirmToken(token) {
  return new Promise((resolve, reject) => {
    const query = {
      confirmEmailToken: token
    };
    const update = {
      confirmEmailToken: '',
      verified: true
    };
    User.findOneAndUpdate(query, update, (err, user) => {
      if (err || user === null) reject(err);
      resolve();
    });
  });
}

/**
 * Hits when the user clicks the link that is sent to their email
 *
 * Will check whether or not the token passed in the URL is valid
 * @param req: Request Object
 * @param req.param.token: Token sent with url
 */
function resetToken(req) {
  return new Promise((resolve, reject) => {
    if (!req.params.token) reject(new Error('No Token Passed to Endpoint'));
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      (err, user) => {
        if (err) {
          reject(new Error('Invalid token'));
        } else if (!user) {
          // User was not found or the token was expired, either way...
          // Signals the front end to tell the user that their token was invalid
          // and that they may need to send another email
          reject(new Error('No User found'));
        } else {
          // The token is valid and will signal front end to render the login page
          // The token we are passing is the same token that is in the database
          resolve(req.params.token);
        }
      }
    );
  });
}

/**
 * Register a new User
 *
 * @example
 * <caption>
 * firstName: 'Miggy',
 * lastName: 'Reyes',
 * username: 'miggylol',
 * email: 'email@gmail.com',
 * classification: 'Freshman',
 * password: 'password'
 * </caption>
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 */
function register(req, res) {
  // If the email is available, continue with the proccess
  // Generates the salt used for hashing
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false
      });
    } else {
      // Passed the hashed password into the saveUser function
      // so that the we can save the user with a hashed password
      saveUser(hash);
    }
  });

  /**
   * This saves the user with the hashed password
   *
   * The data we are going to save into the database
   * The rest of the model has defualt values
   *
   * The data saved is the user's:
   *  * email
   *  * hashed password
   *  * first and last name
   *  * their classification
   *
   * @param {string} hash The hashed password
   */
  function saveUser(hash) {
    const token = generateHexToken();
    const data = {
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      classification: req.body.classification,
      confirmEmailToken: token
    };

    // New User Object from the mongoose User Schema
    const newUser = new User(data);

    // Saves the new user
    newUser.save((err, user) => {
      if (err) {
        // This email is not available
        res.status(200).json({
          success: false,
          emailAvailable: false
        });
      } else {
        // Send back only the user's username and names
        sendConfirmationEmail(user);
        res.status(200).json({
          success: true,
          emailAvailable: true
        });
      }
    });
  }

  /**
   * Sends a confirmation email to the user with a link/endpoint
   * to verify their email
   * @param {Object} user The user object created
   */
  function sendConfirmationEmail(user) {
    const mailOptions = {
      to: user.email,
      from: 'Texas Tech ACM',
      subject: 'Welcome to ACM: TTU',
      html: `<p>Please click on the following link, or paste this into your browser to verify your account:</p>\n\n<a>${
        req.protocol
      }://${req.headers.host}/users/confirm/${
        user.confirmEmailToken
      }</a>\n\n<p>If you did not sign up for an account, please ignore this email.</p>\n`
    };

    global.smtpTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        // This error is usually a connection error
        // Will not throw error is email is not found
        console.log(err);
      } else {
        console.log(`Email send to ${user.email}`);
      }
    });
  }
}

/**
 * @todo Impliment a profile page with resumes and other things
 */
function getProfile(req, res) {
  res.json({ user: req.user });
}

/**
 * Sends email to us from who ever's email was given
 *
 * @param {Object} options - options object
 * @param {string} options.name - student name
 * @param {string} options.email - student email
 * @param {string} options.topic - student topic
 * @param {string} options.message - student message
 *
 * @returns {null}
 */
function contactUs(options) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: options.email,
      to: process.env.email_username,
      subject: 'ACM Question',
      text: `You got a message!\n\nSender: ${options.name}\n\nEmail: ${options.email}\n\nTopic: ${
        options.topic
      }\n\nMessage: ${options.message}\n`
    };

    global.smtpTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve();
    });
  });
}

// Generates a HexToken, usually for quick random tokens; does not require string
function generateHexToken() {
  const token = crypto.randomBytes(20);
  return token.toString('hex');
}

module.exports = {
  login,
  register,
  resetToken,
  confirmToken,
  contactUs,
  forgotLogin,
  resetPassword,
  getProfile
};
