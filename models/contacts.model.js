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
 * Creates a new Google Contacts group if one does not exists given a name
 *
 * @param {string} name - the name for the new group
 */
function addUserToGroupByName(name, exact = true) {
  return new Promise(async (resolve, reject) => {
    let formattedName = name

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

      formattedName = `SDC - ${name} - ${season} ${year}`
    }
  })
}

/**
 * Finds a group given a name, if one is not found, we will create one
 *
 *
 */
function findGroupByName(name) {
  return new Promise(async (resolve, reject) => {
    try {
      // Check for existing group
      const { data } = await Contacts.contactGroups.list()
      // The list of Groups
      const { contactGroups: listOfGroups } = data
      // Check for existing name
      const nameExists = listOfGroups.some((group) => {
        return group.formattedName === formattedName
      })

      if (nameExists) {
        resolve(data)
      } else {
        const options = { requestBody: { contactGroup: { name: formattedName } } }
        const newGroup = await Contacts.contactGroups.create(options)
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  Contacts,
  createContacts,
  addUserToGroupByName,
  findGroupByName
}
