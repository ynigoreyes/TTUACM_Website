const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Controller
const EventsController = require('../controllers/event_c');

router.get('/', EventsController.googleAuthenticate);

module.exports = router;
