const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const secret = require('../config/secrets');
const passport = require('passport');

// Middleware for route guarding
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

// Controller
const UserCrtl = require('../controllers/user_c');


router.post('/contact-us', UserCrtl.contactUs);

router.get('/get-team', UserCrtl.getTeam);

/**
 * Original authentication route used.
 * Might be needed for 0Auth2
 */
// router.post('/login', UserCrtl.authenticate);

router.get('/profile', membersOnlyRoute, UserCrtl.getProfile);

router.post('/update-profile-pic', membersOnlyRoute, UserCrtl.updateProfilePicture);

router.post('/update-profile-bio', membersOnlyRoute, UserCrtl.updateProfileBio);

/* POST forgot page */
router.post('/forgot', UserCrtl.forgotLogin);

router.get('/logout', UserCrtl.logout);

/* POST signup page */
router.post('/signup', UserCrtl.signup);

/* GET confirm page */
router.get('/confirm/:token', UserCrtl.confirmToken);

/* GET reset page */
router.get('/reset/:token', UserCrtl.resetToken);

/* POST reset page */
router.post('/reset/:token', UserCrtl.reset);

// Test Routes

/* POST Registion */
router.post('/register', UserCrtl.register);

/* TEST Post Login */
router.post('/login', UserCrtl.login);

/* Middleware for route guarding */
function membersOnly(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


module.exports = router;

