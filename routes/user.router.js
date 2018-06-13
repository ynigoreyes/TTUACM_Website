const express = require('express');
const passport = require('passport');
const querystring = require('querystring');

// Controller
const UserCrtl = require('../controllers/user.controller');

const router = express.Router();

/**
 * Middleware for route guarding
 * If errors occur, it is probably because front-end is not sending
 * JWT along with their requests
 */
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

// Routes pertaining to the user's account

/* POST Registion */
router.post('/register', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    classification: req.body.classification,
    confirmEmailToken: null
  };
  UserCrtl.register(user)
    .then((user) => {
      UserCrtl.sendConfirmationEmail(user.email, user.confirmEmailToken, req)
        .then(() => {
          res.status(201).json({ user });
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ err });
        });
    })
    .catch((err) => {
      console.log(err);
      if (err === 'unavailable') {
        res.status(404).json({ emailAvailable: false });
      } else {
        res.status(404).json({ err });
      }
    });
});

/* POST Login */
router.post('/login', UserCrtl.login);

/* POST forgot page */
router.post('/forgot', UserCrtl.forgotLogin);

/**
 * Confirms the user has a valid email account
 *
 * - endpoint: `users/confirm/:token`
 * - VERB: GET
 *
 * @typedef {function} UserRouter-confirmToken
 */
router.get('/confirm/:token', (req, res) => {
  UserCrtl.confirmToken(req.params.token)
    .then(() => {
      const qs = querystring.stringify({ verify: 'success' });
      res.redirect(`${process.env.CLIENT}/auth/?${qs}`);
    })
    .catch((err) => {
      console.log('Error Occured');
      console.log(err);
      const qs = querystring.stringify({ err: 'Error Validating Email' });
      res.redirect(`${process.env.CLIENT}/?${qs}`);
    });
});

/**
 * Resends the confirmation email to the requested user
 *
 * - endpoint: `/users/confirm`
 * - VERB: POST
 *
 * @typedef {function} UserRouter-sendConfirmationEmail
 */
router.post('/confirm', (req, res) => {
  UserCrtl.sendConfirmationEmail(req.body.email, req.body.token, req)
    .then(() => {
      res.status(200).json();
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({err: 'Error Sending Confirmation Email'});
    });
});

/**
 * This endpoint is hit by an emai to reset a user password
 *
 * - endpoint: `/users/reset/:token`
 * - Verb: GET
 *
 * @typedef {function} UserRouter-resetToken
 * @param {string} token - A string that contains the HEX code/Reset token
 * of a lost account
 */
router.get('/reset/:token', (req, res) => {
  UserCrtl.resetToken(req.params.token)
    .then((token) => {
      const qs = querystring.stringify({ token });
      res.redirect(`${process.env.CLIENT}/auth/forgot/redirect/?${qs}`);
    })
    .catch((err) => {
      const qs = querystring.stringify({ err });
      res.redirect(`${process.env.CLIENT}/auth/?${qs}`);
      console.log(err);
    });
});

/**
 * Angular hits this endpoint with a token and a new password to update the account with
 *
 * - Endpoint: `/users/reset/:token`
 * - Verb: POST
 *
 * @typedef {function} UserRouter-resetPassword
 */
router.post('/reset/:token', (req, res) => {
  UserCrtl.resetPassword(req.params.token, req.body.password)
    .then((msg) => {
      res.status(200).json({ msg });
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
});

/* GET User profile */
router.get('/profile', membersOnlyRoute, UserCrtl.getProfile);

/**
 * Sends and question to ACM Email
 *
 * - Endpoint: `/users/contact-us`
 * - Verb: POST
 *
 * @typedef {function} UserRouter-contactUs
 */
router.post('/contact-us', (req, res) => {
  const emailInfo = {
    name: req.body.name,
    email: req.body.email,
    topic: req.body.topic,
    message: req.body.message
  };
  UserCrtl.contactUs(emailInfo)
    .then(() => res.status(200).json({}))
    .catch(err => res.status(404).json({ err }));
});

module.exports = router;
