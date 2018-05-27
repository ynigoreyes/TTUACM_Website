const express = require('express');

const router = express.Router();

// Controller
const EventsController = require('../controllers/event_c');

router.get('/', EventsController.getEvents);

module.exports = router;

