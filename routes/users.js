const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const secret = require('../config/secrets');

// Controller
const UserController = require('../controllers/user_c');
router.post('/contact-us', (req, res, next) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: secret.testEmailUsername,
      pass: secret.testEmailPassword
    }
  });

  const mailOptions = {
    from: 'Texas Tech Contact Us',
    to: secret.testEmailUsername,
    subject: "ACM Question",
    html: '<h1>' + 'Sender: ' + req.body.name + ' Message: ' + req.body.message + '</h1>'
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(500).json({success: false});
    } else {
      res.status(200).json({success: true});
    }
    console.log(err, info);
  });
});

router.get('/get-team', UserController.getTeam);

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

