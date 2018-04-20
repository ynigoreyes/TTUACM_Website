const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const secret = require('../config/secrets');
const passport = require('passport');

// Controller
const UserController = require('../controllers/user_c');
router.post('/contact-us', UserController.contactUs);

router.get('/get-team', UserController.getTeam);

// router.post('/login', UserController.authenticate);

router.get('/profile', passport.authenticate('jwt', { session: false }), UserController.getProfile);

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

