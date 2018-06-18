const { google } = require('googleapis');

/**
 * Lists the next 10 events on the user's primary calendar.
 * Requires a oAuth2Client. Configurations can be found in oauth2.config
 */
function listEvents() {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({ version: 'v3', auth: global.oAuth2Client });
    calendar.events.list(
      {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      },
      (err, { data }) => {
        if (err) reject(err);
        const events = data.items;
        if (events.length) {
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
              description: event.description || 'N/A'
            });
            return resolve(eventsList);
          });
        } else {
          // Sends back an empty list
          reject();
        }
      }
    );
  });
}

module.exports = {
  listEvents
};
