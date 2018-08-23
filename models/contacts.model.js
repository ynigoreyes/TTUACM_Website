const { google } = require('googleapis');

let Contacts;

/**
 * Create the Contacts Object for the rest of the functions to use
 * @requires oAuth2Client to be defined and valid. This can be acheived by running
 * ```
 require('</path/to/>oauth2.config.js').loadCredentials().```
 */
function createContacts() {
  return new Promise(async (resolve, reject) => {
    try {
      Contacts = google.people({ version: 'v1', auth: global.oAuth2Client });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Creates a new Google Contacts group given a name
 *
 * @param {string} name - the name for the new group
 */
function createNewGroupByName(name, exact = true) {
  return new Promise(async (resolve, reject) => {
    let formatedName = name

    if (exact) {
      console.log('saving the exact name ', name)
    } else {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getYear()

      // May - December is considered Fall, everything else is Spring
      const season = currentMonth > 4 && currentMonth <= 11 ? 'Fall' : 'Spring'

      // Gets the last two digits of the year
      const year = currentYear.toString().slice(1, 3)

      formatedName = `SDC - ${name} - ${season} ${year}`
    }
    const options = { requestBody: { contactGroup: { name: formatedName } } }
    Contacts.contactGroups.create(options)
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        // Group name has already been taken
        reject(err)
      })
  })
}

function findGroupByName(name) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Contacts.createContacts.list()
      console.log(data)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  Contacts,
  createContacts,
  createNewGroupByName,
  findGroupByName
}
