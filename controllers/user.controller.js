// TODO: Refactor. Move all login and sign authentication to the auth controller.
// Leave all profile manipulation in here
const User = require('../models/user.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');

const contactsManager = require('../models/contacts.model')

// Bcrypt options
const saltRounds = 10;

/**
 * Checks to see if there is a valid username and password combination
 * that also has verified their email
 *
 * @param {string} email - user email
 * @param {string} password - user password
 *
 * @todo What if the user somehow didn't get the verification email. How do we handle that?
 * @returns {Promise.<token, Error>} Resolves with a JWT and rejects with an error
 */
function login(email, password) {
  return new Promise((resolve, reject) => {
    User.getUserByEmail(email, (err, foundUser) => {
      // Internal Server Error
      if (err) {
        reject(err);
        // If the user has not been verified
      } else if (!foundUser) {
        reject(new Error('User Not Found'));
      } else if (!foundUser.verified) {
        reject(new Error('User Not Verified'));
        // If the user has a signed up using a local auth strategy
      } else if (foundUser !== null && foundUser.password !== null) {
        bcrypt.compare(password, foundUser.password, async (err, response) => {
          if (err) {
            reject(err);
          } else if (response) {
            const token = await generateJWTToken(foundUser);
            resolve({ token, foundUser });
          } else {
            reject(new Error('Invalid Login'));
          }
        });
      } else {
        // If the was no user found with that user name
        reject(new Error('Internal Server Error'));
      }
    });
  });
}

/**
 * Starts the process of reseting a lost password for an existing user
 *
 * @param {string} email - user email
 * @returns {Promise.<null, Object>} Resolves: object containg a HEX and a user, Rejects: error
 */
function forgotLogin(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, user) => {
      if (user === null) {
        reject(new Error('User not found'));
      } else if (err) {
        reject(err);
      } else {
        user.resetPasswordToken = token = generateHexToken();
        user.resetPasswordExpires = Date.now() + 3 * 60 * 60 * 1000; // 3 Hours
        user.save((err) => {
          if (err) reject(err);
          resolve({ token, user });
        });
      }
    });
  });
}

/**
 * Send the reset email to the user
 *
 * @param {string} email - users email
 * @param {string} token - HEX token/reset token
 * @param {Object} req - Express Request Object
 * @returns {Promise.<null, Error>} Rejects with an error if there is something wrong with the email
 * @todo Make this look cleaner
 */
function sendResetEmail(token, email, req) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
      const mailOptions = {
        to: email,
        from: 'Texas Tech ACM',
        subject: 'TTU ACM Password Reset',
        html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n</p>\n\n<a>${
          req.protocol
        }://${
          req.headers.host
        }/api/users/reset/${token}</a>\n\n<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>\n`
      };
      global.smtpTransporter.sendMail(mailOptions, (err) => {
        if (err) reject(err);
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Hits when the user clicks the link that is sent to their email
 *
 * Will check whether or not the token passed in the URL is valid
 * @param {string} token - HEX token associated with an account (resetPasswordToken)
 * @returns {Promise.<token, Error>} Resolves: HEX Token, Rejects: an error
 */
function resetToken(token) {
  return new Promise((resolve, reject) => {
    if (!token) reject(new Error('No Token Passed to Endpoint'));
    User.findOne(
      {
        resetPasswordToken: token,
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
          resolve(token);
        }
      }
    );
  });
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
  return new Promise(async (resolve, reject) => {
    try {
      const user = await verifyUser(token, password);
      await sendChangedPasswordEmail(user.email);
      resolve(user);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

/**
 * Verifies the user based on whether or not they pass a valid JWT Token
 * and checks to see if the user actually exists
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
          if (!user) reject(new Error('No User Found'));
          resolve(user);
        }
      );
    });
  });
}

/**
 * Send the notification to the user that informtion in their account has changed
 *
 * @param {string} email User's email
 * @returns {Promise.<null, Error>} Rejects with an error if there is something wrong with the email
 */
function sendChangedPasswordEmail(email) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
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
    } else {
      resolve();
    }
  });
}

/**
 * Endpoint hit when a user clicks on their confirmation link
 *
 * Compares the url token with the token saved in the database.
 * If thre is a match, the user is verified and redirected to log in
 * @param {string} token - HEX Token
 * @returns {Promise.<null, Error>} Rejects: an error
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
    User.findOneAndUpdate(query, update, { new: true }, (err, user) => {
      if (err || user === null) reject(err);
      resolve(user);
    });
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
 * @param {Object} user - user object
 * @param {string} user.password - user password
 *
 * @returns {Promise.<Object, Error>} Resolves with a user objectand rejects with an error
 */
function register(user) {
  return new Promise((resolve, reject) => {
    // If the email is available, continue with the proccess
    // Generates the salt used for hashing
    User.findOne({ email: user.email }, (err, user) => {
      if (err) reject(err);
      if (user) reject(new Error('unavailable'));
    });
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
      if (err) reject(err);
      const token = await generateHexToken();

      user.password = hash;
      user.confirmEmailToken = token;
      user.verified = false;

      // New User Object from the mongoose User Schema
      const newUser = new User(user);

      // Saves the new user
      newUser.save((err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  });
}

/**
 * Sends a confirmation email to the user with a link/endpoint
 * to verify their email
 *
 * @param {Object} email - User's Email
 * @param {Object} req - Express Request Object
 * @returns {Promise.<null, Error>}
 */
function sendConfirmationEmail(email, token, req) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
      const mailOptions = {
        to: email,
        from: 'Texas Tech ACM',
        subject: 'Welcome to ACM: TTU',
        html: `<p>Please click on the following link, or paste this into your browser to verify your account:</p>\n\n<a>${
          req.protocol
        }://${
          req.headers.host
        }/api/users/confirm/${token}</a>\n\n<p>If you did not sign up for an account, please ignore this email.</p>\n`
      };
      global.smtpTransporter.sendMail(mailOptions, (err) => {
        if (err) reject(err);
        resolve();
        console.log(`Email send to ${email}`);
      });
    } else {
      resolve();
    }
  });
}

/**
 * Fetches the user's profile
 *
 * @param {string} email - user's unique email
 * @returns {Promise.<object, Error>} Resolves: a user object; Rejects: Error
 */
function getProfile(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) reject(new Error('Email Not Found'));
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Fetches the user's profile
 *
 * @deprecated - start using updateUser
 *
 * @param {string} path - user's unique path to resume on Firebase
 * @param {string} id - user's id
 * @returns {Promise.<object, Error>} Resolves: a user object; Rejects: Error
 */
function updateResume(id, path) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(id, {resume: path}, {new: true})
      .then((user) => {
        if (!user) reject(new Error('User Not Found'));
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Updates the complete user object
 *
 * @param {object} newUser new user object
 * @returns {Promise.<object, Error>} Resolves: a new user object and token; Rejects: Error
 */
function updateUser(newUser) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findByIdAndUpdate(newUser._id, newUser, { new: true }).exec();
      if (!user) reject(new Error('User Not Found'));
      const token = await generateJWTToken(user);
      const response = { user, token };
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
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
 * @returns {Promise.<null, Error>}
 */
function contactUs(options) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'test') {
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
    } else {
      resolve();
    }
  });
}

/**
 * Adds the user to the ACM Contacts
 *
 * @param {object} data.user - user object
 * @param {string} data.user.email - user's email
 * @param {string} data.topic - user's interest
 * @param {string} data.otherTopic - user's other interests
 */
function updateACMContactsGroup(data) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

/**
 * Adds the user to a SDC Group
 */
function addUserToInterestGroup(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const { topic, otherTopic, user } = data;
      if (topic !== 'Other') {
        await contactsManager.createNewGroupByName(topic, exact = false)
      }
    } catch (err) {
      if (err.code === 409) {
        console.log('Group Name already taken, adding to group instead')
      }
      reject(err)
    }
  });
}

// Generates a HexToken, usually for quick random tokens; does not require string
function generateHexToken() {
  const token = crypto.randomBytes(20);
  return token.toString('hex');
}

/**
 * Generates a JWT
 *
 * @param {object} payload all the data that will be stored into the token
 */
function generateJWTToken(payload) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ data: payload },
      process.env.session_secret, {
        expiresIn: 604800 // 1 week
      });
    if (token === '') {
      reject(new Error('Empty payload'));
    }
    resolve(token);
  });
}

module.exports = {
  addUserToInterestGroup,
  confirmToken,
  contactUs,
  forgotLogin,
  getProfile,
  login,
  register,
  resetToken,
  resetPassword,
  sendConfirmationEmail,
  sendChangedPasswordEmail,
  sendResetEmail,
  updateResume,
  updateUser,
  updateACMContactsGroup,
  verifyUser
};
