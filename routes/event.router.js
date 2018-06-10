const express = require('express');

const router = express.Router();

// Controller
const EventsController = require('../controllers/event.controller');

router.get('/', EventsController.getEvents);

module.exports = router;

