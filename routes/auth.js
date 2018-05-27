const express = require('express');
const passport = require('passport');

const authRouter = express.Router();
const AuthCtrl = require('../controllers/auth_c');

/* GETS the Google Login Screen */
authRouter.get('/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email']
}));

/* Callback URL for Google */
authRouter.get('/google/redirect', passport.authenticate('google'), AuthCtrl.oauth2);

authRouter.get('/google/calendar', (req, res) => {
  console.log(res, req);
});

/* GETS the GitHub Login Screen */
authRouter.get('/github', passport.authenticate('github', {
  scope: [
    'user'
  ]
}));

/* Callback URL for GitHub */
authRouter.get('/github/redirect', passport.authenticate('github'), AuthCtrl.oauth2);

module.exports = authRouter;
