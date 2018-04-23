const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const secret = require('../config/secrets');
const passport = require('passport');
const multer = require('multer');
const multerConfig = require('../config/storage');

// Multer options
const profilePictureUploads = multer({
  storage: multerConfig.profilePictureStorage
  // fileFilter: multerConfig.jpegFileFilter
});

// Middleware for route guarding
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

// Controller
const UserController = require('../controllers/user_c');


router.post('/contact-us', UserController.contactUs);

router.get('/get-team', UserController.getTeam);

/**
 * Original authentication route used.
 * Might be needed for 0Auth2
 */
// router.post('/login', UserController.authenticate);

router.get('/profile', membersOnlyRoute, UserController.getProfile);

router.post('/update-profile-pic', membersOnlyRoute, profilePictureUploads.single('image'), UserController.updateProfilePicture);

router.post('/update-profile-bio', membersOnlyRoute, UserController.updateProfileBio);

/* POST forgot page */
router.post('/forgot', UserController.forgotLogin);

router.get('/logout', UserController.logout);

/* POST signup page */
router.post('/signup', UserController.signup);

/* GET confirm page */
router.get('/confirm/:token', UserController.confirmToken);

/* GET reset page */
router.get('/reset/:token', UserController.resetToken);

/* POST reset page */
router.post('/reset/:token', UserController.reset);

// Test Routes

/* POST Registion */
router.post('/register', UserController.register);

/* TEST Post Login */
router.post('/login', UserController.login);

/* Middleware for route guarding */
function membersOnly(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}


module.exports = router;

