const express = require('express');
const passport = require('passport');

// Controller
const UserCrtl = require('../controllers/user_c');

const router = express.Router();

// Middleware for route guarding
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

// Routes pertaining to the user's account

/* POST Registion */
router.post('/register', UserCrtl.register);

/* POST Login */
router.post('/login', UserCrtl.login);

/* GET Log Out */
router.get('/logout', UserCrtl.logout);

/* POST forgot page */
router.post('/forgot', UserCrtl.forgotLogin);

/* GET confirm page */
router.get('/confirm/:token', UserCrtl.confirmToken);

/* GET reset page */
router.get('/reset/:token', UserCrtl.resetToken);

/* POST reset page */
router.post('/reset/:token', UserCrtl.reset);

/* GET User profile */
router.get('/profile', membersOnlyRoute, UserCrtl.getProfile);

/* POST Update User Profile Picture */
router.post('/update-profile-pic', membersOnlyRoute, UserCrtl.updateProfilePicture);

/* POST Update User Bio */
router.post('/update-profile-bio', membersOnlyRoute, UserCrtl.updateProfileBio);

// The Other routes

/* POST Contact Us */
router.post('/contact-us', UserCrtl.contactUs);

/* GET The current Team */
router.get('/get-team', UserCrtl.getTeam);


/**
 * Original authentication route used.
 * Might be needed for 0Auth2
 */
// router.post('/login', UserCrtl.authenticate);

module.exports = router;

