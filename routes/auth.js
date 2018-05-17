const express = require('express');
const passport = require('passport');

const authRouter = express.Router();
const AuthCtrl = require('../controllers/auth_c');

/* GETS the Google Login Screen */
authRouter.get('/google', passport.authenticate('google', {scope: ['profile']}));

/* Callback URL for Google */
authRouter.get('/google/redirect', passport.authenticate('google'), AuthCtrl.oauth2);

/* GETS the GitHub Login Screen */
authRouter.get('/github', passport.authenticate('github'));

/* Callback URL for GitHub */
authRouter.get('/github/redirect', passport.authenticate('github'), AuthCtrl.oauth2);

module.exports = authRouter;
