const User = require('../models/user');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Bcrypt options
const bcrypt = require('bcryptjs');

const saltRounds = 10;


/**
 * Transporter for nodemailer
 * We are using a test email and password.
 * I took this out so that we could dry up some of the code
 */
const smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.dev_emailUsername,
    pass: process.env.dev_emailPassword,
  },
});

// Test Login Route for exports.authenticate
exports.login = (req, res) => {
  const email = req.body.email;
  const inputPassword = req.body.password;

  // In the test, we are not able to see the email passed
  User.getUserByEmail(email, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        success: false,
        user: null,
        msg: 'Unknown Error has occured, Please try again later'
      });
    } else if (foundUser !== null) {
      // If there is a user with that email, check their password
      bcrypt.compare(inputPassword, foundUser.password, (err, response) => {
        if (err) { console.log(err); }
        if (response) {
          // We don't want to pass back the password at all
          const token = jwt.sign({ data: foundUser }, process.env.session_secret, {
            expiresIn: 604800, // 1 week
          });

          res.status(200).json({
            success: true,
            user: foundUser,
            token: `JWT ${token}`,
          });
        } else {
          res.status(200).json({
            success: false,
            user: null,
            msg: 'Invalid Login'
          });
        }
      });
    } else {
      // If the was no user found with that user name
      res.status(200).json({
        success: false,
        user: null,
        msg: 'User Not Found'
      });
    }
  });
};

// I will fix this lol
// Work on this after finals
exports.forgotLogin = (req, res, next) => {
  async.waterfall([

    // This is where we create a temporary token
    function funcNamePlaceHolder1(done) {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex');
        done(err, token);
      });
    },

    // We save the token into the user document along with an expiration date
    function funcNamePlaceHolder2(token, done) {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('forgotMessage', 'No account with that email was found.');
          return res.redirect('/forgot');
        } else if (err) {
          req.flash('forgotMessage', 'Error');
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 10800000; // 3 Hours
        user.save((err) => {
          done(err, token, user);
        });
      });
    },

    // Sends the email to the user that requested a password reset
    function funcNamePlaceHolder3(token, user, done) {
      const mailOptions = {
        to: user.email,
        from: 'Texas Tech ACM',
        subject: 'TTU ACM Password Reset',
        text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n'}${
          req.protocol}://${req.headers.host}/reset/${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('forgotMessage', `An email has been sent to ${user.email} with a reset link.`);
        done(err, 'done');
      });
    },
  ], (err) => {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};

// We should fix this too. Can we go over what this is supposed to do?
exports.reset = (req, res) => {
  async.waterfall([
    function funcNamePlaceHolder1(done) {
      User.findOne({ 'resetPasswordToken': req.params.token, 'resetPasswordExpires': { $gt: Date.now() } }, (err, user) => {
        if (!user) req.flash('resetMessage', 'Password reset link is invalid or expired.');
        else if (req.body.password !== req.body.confirmPassword) {
          req.flash('forgotMessage', 'Password and confirm password must match.');
          return res.redirect('/forgot');
        } else if (err) {
          req.flash('forgotMessage', 'Password and confrim password must match.');
          return res.redirect('/forgot');
        } else {
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save((err) => {
            if (err) {
              req.flash('loginMessage', 'Error saving to database')
              return res.redirect('/login')
            }
            req.logIn(user, function (err) {
              done(err, user)
            }
            )
          });
        }
      });
    },
    function funcNamePlaceHolder2(user, done) {
      const mailOptions = {
        to: user.email,
        from: 'acmtexastech@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account has been changed.\n',
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('resetMessage', 'Your password has been changed.');
        done(err);
      });
    },
    // TODO: Write error handling
  ], (err) => {
    res.redirect('/');
    if (err) {
      req.flash('loginMessage', 'Error sending confirmation email');
      res.redirect('/login');
    }
  });
};

/**
 * Endpoint hit when a user clicks on their confirmation link
 *
 * Compares the url token with the token saved in the database.
 * If thre is a match, the user is verified and redirected to log in
 */
exports.confirmToken = (req, res) => {
  const query = {
    confirmEmailToken: req.params.token
  };
  const update = {
    confirmEmailToken: '',
    verified: true
  };
  User.findOneAndUpdate(query, update, (err, user) => {
    if (err || user === null) {
      res.redirect(`${req.protocol}://${req.headers.host}/error`);
    } else {
      res.redirect(`${req.protocol}://${req.headers.host}/login`);
    }
  });
};

exports.resetToken = (req, res) => {
  User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('forgotMessage', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    if (err) {
      req.flash('forgotMessage', 'Error');
      return res.redirect('/forgot');
    }
    // TODO: Move some of this functionality to Angular
    // Figure out how this flash messaging module works
    // What are the modules being passed to this render method?
    res.render('reset', { user: req.user, message: req.flash('resetMessage') });
  });
};

/**
 * This is a test for the registration.
 * I'm not sure how the signup method up top really works so I will test my
 * http req on this route
 *
 * This is how the object will look...
 * {
 * firstName: 'Miggy',
 * lastName: 'Reyes',
 * username: 'miggylol',
 * email: 'email@gmail.com',
 * classification: 'Freshman',
 * password: 'password'
 * }
 *
 * This can be accessed using req.body.
 *
 * This can also be used when the user does not want to use an auth service
 */
exports.register = (req, res) => {
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
   * @param {object} user The user object created
   */
  function sendConfirmationEmail(user) {
    const mailOptions = {
      to: user.email,
      from: 'Texas Tech ACM',
      subject: 'Welcome to ACM: TTU',
      html: `<p>Please click on the following link, or paste this into your browser to verify your account:</p>\n\n<a>${req.protocol}://${req.headers.host}/users/confirm/${user.confirmEmailToken}</a>\n\n<p>If you did not sign up for an account, please ignore this email.</p>\n`,
    };

    smtpTransport.sendMail(mailOptions, (err) => {
      if (err) {
        // This error is usually a connection error
        // Will not throw error is email is not found
        console.log(err);
      } else {
        console.log(`Email send to ${user.email}`);
      }
    });
  }
};

/**
 * Gets the user's profile based on the ID in their
 * local storage
 */
exports.getProfile = (req, res) => {
  res.json({ user: req.user });
};

exports.contactUs = (req, res) => {
  const mailOptions = {
    from: `ACM: Texas Tech Contact Us <${process.env.dev_emailUsername}>`,
    to: process.env.dev_emailUsername,
    subject: 'ACM Question',
    html: `<h1> Sender: ${req.body.name}${'\n\n'}Topic: ${req.body.topic}${'\n\n'}Message: ${req.body.message}</h1>`,
  };

  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false });
    } else {
      console.log(`Message Sent to ${secret.testEmailUsername} at ${Date()}`);
      res.status(200).json({ success: true });
    }
  });
};

function generateHexToken() {
  const token = crypto.randomBytes(20);
  return token.toString('hex');
}
