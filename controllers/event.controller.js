const { google } = require('googleapis');
const axios = require('axios');

let calendar;
const calendarId = 'primary';

/**
 * Create the Calendar Object for the rest of the functions to use
 * @requires oAuth2Client to be defined and valid. This can be acheived by running
 * ```
 require('</path/to/>oauth2.config.js').loadCredentials().```
 */
function createCalendar() {
  return new Promise(async (resolve, reject) => {
    try {
      calendar = google.calendar({ version: 'v3', auth: global.oAuth2Client });
      resolve(calendar);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Gets the raw events object
 * @returns { Promise.<Array, Error> } a Promise
 * @reject Error (if no events are found)
 * @resolve A list of events
 */
function getRawEvents() {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      },
      (err, { data }) => {
        if (err) {
          reject(err);
        } else if (!data.items.length) {
          reject(new Error('No Events Found'));
        } else {
          resolve(data.items);
        }
      }
    );
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @requires oAuth2Client - Configurations can be found in oauth2.config
 */
function listEvents() {
  return new Promise(async (resolve, reject) => {
    getRawEvents()
      .then((events) => {
        // console.log(events);
        // Will store all of the events and return
        eventsList = [];
        // Maps all of the numbers to days
        const weekday = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ];
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          const end = event.end.dateTime || event.end.date;
          // Event Object
          eventsList.push({
            id: i + 1,
            day: `${weekday[new Date(start).getDay()]}`,
            startTime: start,
            endTime: end,
            title: event.summary || 'N/A',
            location: event.location || 'N/A',
            creator: event.creator.displayName || 'N/A',
            description: event.description || 'N/A',
            eventId: event.id // Event ID according to Google
          });
          return resolve(eventsList);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * Lists all attendees for an event
 * Rejects with an error
 * Resolves with an array with a null email if empty or the list of attendees
 *
 * @param {string} eventId Event ID
 * @requires oAuth2Client - Configurations can be found in oauth2.config
 * @returns {Promise.<Array<Object>>} A Promise
 */
function getAttendees(eventId) {
  return new Promise((resolve, reject) => {
    calendar.events.get(
      {
        calendarId,
        eventId
      },
      (err, { data }) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.attendees || []);
        }
      }
    );
  });
}

/**
 * Adds an attendee to an event
 *
 * @param {string} eventId the event ID
 * @param {Array} currentAttendees the current attendees for the event
 * @param {string} email the user's email
 * @returns {Array<Object>} updated attendee list
 */
function addAttendee(currentAttendees, email) {
  return new Promise(async (resolve, reject) => {
    try {
      currentAttendees.push({ email });
      resolve(currentAttendees);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Removes the attendee by their email
 *
 * @requires currentAttendees to not by empty
 * @param {Array} currentAttendees the attendees list to remove from
 * @param {string} email the user's email
 * @returns {Array<Object>} updated attendee list
 */
function removeAttendee(currentAttendees, email) {
  return new Promise(async (resolve, reject) => {
    try {
      if (currentAttendees.length === 0) throw new Error('No attendees found');
      const originalAttendees = currentAttendees;
      currentAttendees = currentAttendees.filter((each) => {
        return each.email !== email.toLowerCase();
      });
      if (originalAttendees.length === currentAttendees.length) {
        throw new Error('No user found');
      }
      resolve(currentAttendees);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Replaces the event's attendees with the attendees list
 * Rejects with an Error
 * Resolves with the new event object
 *
 * Fun Fact: Google's API deletes duplicates by default
 *
 * This functionality is already tested by Google.
 * DO NOT test this function as it interacts with real google calendars
 *
 * @requires oAuth2Client - Configurations can be found in oauth2.config
 * @param {string} eventId user's event ID
 * @param {Array<Object>} attendees array of attendees
 * @returns {Promise<Array<Object>>} A Promise
 */
function updateAttendee(eventId, attendees) {
  return new Promise(async (resolve, reject) => {
    calendar.events.patch(
      {
        calendarId,
        eventId,
        resource: {
          attendees
        }
      },
      (err, { data }) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

module.exports = {
  createCalendar,
  getRawEvents,
  listEvents,
  getAttendees,
  addAttendee,
  removeAttendee,
  updateAttendee
};
