const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Controller
const UserController = require('../controllers/user_c');

router.post('/login', UserController.authenticate);

/* POST forgot page */
router.post('/forgot', UserController.forgotLogin);

/* GET logout page */
router.get('/logout', UserController.logout);

/* POST signup page */
router.post('/signup', UserController.signup);

/* GET confirm page */
router.get('/confirm/:token', UserController.confirmToken);

/* GET reset page */
router.get('/reset/:token', UserController.resetToken);

/* POST reset page */
router.post('/reset/:token', UserController.reset);

// Middleware for route guarding
function membersOnly(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;

