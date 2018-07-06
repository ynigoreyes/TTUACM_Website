const express = require('express');
const passport = require('passport');
const querystring = require('querystring');

const controller = require('../controllers/event.controller');

const router = express.Router();
/**
 * Middleware for route guarding
 * If errors occur, it is probably because front-end is not sending
 * JWT along with their requests
 */
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

/**
 * Gets all the events in ACM Google Calendar using an OAuth2 Object
 *
 * - Endpoint: `/api/events`
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

/**
 * Gets all attendees for an event
 *
 * - Endpoint `/api/events/attendee`
 * - Verb: GET
 *
 * @typedef {function} EventsRouter-getAttendees
 */
router.get('/attendee/:id', (req, res) => {
  controller
    .getAttendees(req.params.id)
    .then((attendees) => {
      res.status(200).json({ err: null, attendees});
    })
    .catch((err) => {
      console.error(err.errors);
      res.status(404).json({});
    });
});

/**
 * Adds an attendee to the event
 *
 * - Endpoint `/api/events/attendee`
 * - Verb: PATCH
 *
 * @param {string} req.body.email - user's email
 * @typedef {function} EventsRouter-addAttendee
 */
router.patch('/attendee/:id', membersOnlyRoute, async (req, res) => {
  try {
    const currentAttendees = await controller.getAttendees();
    if (currentAttendees[0].email === null) {
      currentAttendees.pop();
    }
    const updatedAttendeeList = await controller.addAttendee(currentAttendees, req.body.email);
    const updatedEvent = await controller.updateAttendee(req.params.id, updatedAttendeeList);
    res.status(200).json({err: null, updatedEvent });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err, updatedEvent: null });
  }
});

/**
 * Adds an attendee to the event
 *
 * - Endpoint `/api/events/attendee`
 * - Verb: DELETE
 *
 * @typedef {function} EventsRouter-removeAttendee
 */
router.delete('/attendee/:id', async (req, res) => {
  try {
    const currentAttendees = await controller.getAttendees();
    if (currentAttendees.length === 0) throw new Error('No attendees found');
    const updatedAttendeeList = await controller.removeAttendee(currentAttendees, req.body.email);
    const updatedEvent = await controller.updateAttendee(req.params.id, updatedAttendeeList);
    res.status(200).json({ err: null, updatedEvent });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err, updatedEvent: null });
  }
});

/**
 * Gets all raw event objects: Mainly used for testing
 *
 * - Endpoint `/api/events/raw`
 * - Verb: GET
 *
 * @typedef {function} EventsRouter-getRawEvents
 */
router.get('/raw', (req, res) => {
  controller
    .getRawEvents()
    .then((events) => {
      res.status(200).json({ err: null, events });
    })
    .catch((err) => {
      res.status(404).json({ err, events: null });
    });
});

module.exports = router;
