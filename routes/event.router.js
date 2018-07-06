const express = require('express');
const passport = require('passport');

const controller = require('../controllers/event.controller');

const router = express.Router();
/**
 * Middleware for route guarding
 * If errors occur, it is probably because front-end is not sending
 * JWT along with their requests
 */
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

/**
 * Gets all the events (formatted) in ACM Google Calendar using an OAuth2 Object
 *
 * - Endpoint: `/api/events`
 * - GET
 *
 * @typedef {function} EventsRouter-listEvents
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
      res.status(200).json({ err: null, attendees });
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
  console.log('Add Route');
  try {
    const eventId = req.params.id;
    const currentAttendees = await controller.getAttendees(eventId);
    const updatedAttendeeList = await controller.addAttendee(currentAttendees, req.body.email);
    const updatedEvent = await controller.updateAttendee(eventId, updatedAttendeeList);
    res.status(200).json({ err: null, updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(404).json({ err, updatedEvent: null });
  }
});

/**
 * Deletes an attendee for an event
 *
 * - Endpoint `/api/events/remove-attendee`
 * - Verb: patch
 *
 * @param {string} req.params.id event ID
 * @typedef {function} EventsRouter-removeAttendee
 */
router.patch('/remove-attendee/:id', async (req, res) => {
  console.log('Remove Route');
  try {
    const eventId = req.params.id;
    const currentAttendees = await controller.getAttendees(eventId);
    const updatedAttendeeList = await controller.removeAttendee(currentAttendees, req.body.email);
    const updatedEvent = await controller.updateAttendee(eventId, updatedAttendeeList);
    res.status(200).json({ err: null, updatedEvent });
  } catch (err) {
    console.error(err);
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
