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
router.post('/register', UserCrtl.register);

/* POST Login */
router.post('/login', UserCrtl.login);

/* POST forgot page */
router.post('/forgot', UserCrtl.forgotLogin);

/* GET confirm page */
router.get('/confirm/:token', UserCrtl.confirmToken);

/* GET reset page (This is the route that the email hits) */
router.get('/reset/:token', (req, res) => {
  UserCrtl.resetToken(req)
    .then((token) => {
      const qs = querystring.stringify({ token });
      res.redirect(`${process.env.CLIENT}/auth/forgot/redirect/?${qs}`);
    })
    .catch((err) => {
      const qs = querystring.stringify({ err });
      res.redirect(`${process.env.CLIENT}/auth/?${qs}`);
      console.log(err.message);
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
