const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async');
const User = require('../models/user');
const config = require('../config/database');

exports.authenticate = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

exports.forgotLogin = (req, res, next) => {
  async.waterfall([

    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function (token, done) {
      User.findOne({ 'local.email': req.body.email }, function (err, user) {
        if (!user) {
          req.flash('forgotMessage', 'No account with that email was found.');
          return res.redirect('/forgot');
        } else if (err) {
          req.flash('forgotMessage', 'Error');
          return res.redirect('/forgot');
        }
        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 10800000; // 3 Hours
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },

    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          // TODO: Use OAuth2
          user: 'acmtexastech@gmail.com',
          pass: 'w1nnersallofus'
        }
      });
      var mailOptions = {
        to: user.local.email,
        from: 'Texas Tech ACM',
        subject: 'TTU ACM Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          req.protocol + '://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('forgotMessage', 'An email has been sent to ' + user.local.email + ' with a reset link.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

exports.signup = passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true
});

exports.reset = (req, res, next) => {
  async.waterfall([
    function (done) {
      User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function (err, user) {
        if (!user) req.flash('resetMessage', 'Password reset link is invalid or expired.')
        else if (req.body.password !== req.body.confirmPassword) {
          req.flash('forgotMessage', 'Password and confirm password must match.')
          return res.redirect('/forgot')
        } else if (err) {
          req.flash('forgotMessage', 'Password and confrim password must match.')
          return res.redirect('/forgot')
        } else {
          user.local.password = req.body.password
          user.local.resetPasswordToken = undefined
          user.local.resetPasswordExpires = undefined
          user.save(function (err) {
            if (err) {
              req.flash('loginMessage', 'Error saving to database')
              return res.redirect('/login')
            }
            req.logIn(user, function (err) {
              done(err, user)
            }
            )
          })
        }
      })
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'acmtexastech@gmail.com',
          pass: 'w1nnersallofus'
        }
      })
      var mailOptions = {
        to: user.local.email,
        from: 'acmtexastech@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account has been changed.\n'
      }
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('resetMessage', 'Your password has been changed.')
        done(err)
      })
    }
    // TODO: Write error handling
  ], function (err) {
    res.redirect('/')
    if (err) {
      req.flash('loginMessage', 'Error sending confirmation email')
      res.redirect('/login')
    }
  })
};

// Fix the routes
exports.confirmToken = (req, res) => {
  User.findOne({ 'local.confirmEmailToken': req.params.token }, function (err, user) {
    if (!user) {
      return res.redirect('/users/login');
    } else if (err) {
      req.flash('loginMessage', 'Error');
      return res.redirect('/users/login');
    }
    // How are we able to call verify on user?
    // What kind of object is user?
    user.verify(req.params.token, function (err) {
      if (err) {
        console.log('Error saving to database.');
        req.flash('loginMessage', 'Error saving to database.');
        return res.redirect('/users/login');
      }
      req.flash('loginMessage', 'Account verified! Please login.');
      return res.redirect('/users/login');
    })
  })
};

exports.resetToken = (req, res) => {
  User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function (err, user) {
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
  })
};
