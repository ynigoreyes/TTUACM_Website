const { google } = require('googleapis')
const mongoose = require('mongoose')

const contactsSchema = mongoose.Schema({
  // User's email
  email: { type: String, required: true },
  // User's resource name according to Google People API
  userResourceName: { type: String, default: '' },
  // User's group resourceName
  sdcGroupResourceNames: { type: [String], default: []}
})

const Contacts = module.exports = mongoose.model('Contacts', contactsSchema)

// Google People API manager
let ContactsAPI;

/**
 * Create the Contacts Object for the rest of the functions to use
 * @requires oAuth2Client to be defined and valid. This can be acheived by running
 * ```
 require('</path/to/>oauth2.config.js').loadCredentials().```
 */
Contacts.createContacts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      ContactsAPI = google.people({ version: 'v1', auth: global.oAuth2Client });
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
Contacts.updateUsersInterestGroup = (name, exact = true) => {
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
    reject(new Error('function unfinished'))
    // resolve(formattedName)
    // TODO: Add the user addition logic here.
  })
}


/**
 * Deletes a contact from one group and adds them to another by email
 *
 * @param {string} resourceName - the resource name of the contact
 * @param {string} oldGroup - resourceName for old Group
 * @param {string} newGroup - resourceName for new group
 *
 * @return {Promise<Object, Error>} resolves with the new group instance
 */
Contacts.deteleUserContactGroups = (resouceName, oldGroup, newGroup) => {
  return new Promise(async (resolve, reject) => {
    resolve()
  })
}

/**
 * Finds a contact given their email address
 *
 * @param {string} email - user's email
 */
Contacts.findContactByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const connectionOptions = {
      resourceName: 'people/me',
      personFields: 'names',
    }
    const { connections } = ContactsAPI.people.connections.list(options)
    const user = connections.filter((each, i) => {
      let exists = false
      for (let i = 0; i < each.emailAddresses.length; i += 1) {
        if (email === each.emailAddresses[i]) {
          exists = true
          break;
        }
      }
      return exists
    })

    if (user.length !== 0) {
      resolve(user[0].resourceName)
    } else {
      const err = new Error('No User with given email found')
      err.code = 404
      reject(err)
    }
  })
}

/**
 * Finds a Contact given a resource Name
 *
 * Values of interest:
 * response.resourceName
 * response.names[0].displayName
 * response.emailAddresses[0].value
 * responses.memberships[all of them].contactGroupMembership.contactGroupId
 *
 * @param {string} resourceName - contact's resource name
 * @return {Promise<Object, Error} - Resolves with the name, groups and emails of the user
 */
Contacts.findContactsByResourceName = (resourceName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        resourceName,
        personFields: 'names,emailAddresses,memberships'
      }
      const data = await ContactsAPI.people.get(options)
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Drops a user by their email address from all groups and overall contacts
 * This works by searching for their email on all the email addresses.
 *
 * @param {string} email - the email to delete
 * @return {Promise<null, Error}
 */
Contacts.removeContactFromGroupByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listOptions = {
        resourceName: 'people/me',
      }
      const people = await ContactsAPI.people.connections.list(options)
      const founduser = people.filter((person, i) => {
        return person.emailAddresses.contains(email)
      })

      deleteOptions = {
        resourceName: foundUser.resourceName
      }
      await ContactsAPI.people.deleteContact(options)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Creates a new Contact that will be saved into MyContacts
 *
 * @param {string} name - name of contact
 * @param {string} email - email of contact
 *
 * @return {Promise<object, Error} - The new contact metadata
 */
Contacts.createNewContact = (name, email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        parent: 'people/me',
        requestBody: {
          emailAddresses: [
            {
              displayName: name,
              value: email,
            }
          ]
        }
      };
      const newContact = await ContactsAPI.people.createContact(options);
      resolve(newContact);
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Finds a group given a name, if one is not found, we will create one
 *
 * @param {string} name - name of the group to find
 * @return {Promise<Object, Error>}
 */
Contacts.findGroupByName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check for existing group
      const { data } = await ContactsAPI.contactGroups.list()
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
        const newGroup = await ContactsAPI.contactGroups.create(options)
        resolve(newGroup)
      }
    } catch (err) {
      reject(err)
    }
  })
}

