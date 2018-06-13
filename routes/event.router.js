const express = require('express');

const router = express.Router();

const EventsController = require('../controllers/event.controller');

/**
 * Gets all the events using an OAuth2 Object
 *
 * - Endpoint: `/events`
 * - GET
 *
 * @typedef {function} EventsRouter-getEvents
 */
router.get('/', EventsController.getEvents);

module.exports = router;

