const express = require('express');

const router = express.Router();

const controller = require('../controllers/event.controller');

/**
 * Gets all the events in ACM Google Calendar using an OAuth2 Object
 *
 * - Endpoint: `/events`
 * - GET
 *
 * @typedef {function} EventsRouter-getEvents
 */
router.get('/', (req, res) => {
  controller
    .listEvents()
    .then((events) => {
      res.status(200).json({ events });
    })
    .catch((err) => {
      if (err) console.log(err);
      res.status(404).json({ events: [], err });
    });
});

module.exports = router;
