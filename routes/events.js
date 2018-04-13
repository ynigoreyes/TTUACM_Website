const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Controller
const EventsController = require('../controllers/event_c');

router.get('/', EventsController.googleAuthenticate);

// Fake API to Test Templating
router.get('/get-events', EventsController.getEvents);

module.exports = router;

