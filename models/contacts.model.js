// people/c903523785491539444
// %EgUBAj03LhoMAQIDBAUGBwgJCgsMIgwxQWFIZDJ3WHpDMD0=
// contactGroups/7fa6f8e0efef20d
const { google } = require('googleapis')
const mongoose = require('mongoose')

const contactsSchema = mongoose.Schema({
  // User's email
  email: { type: String, required: true, unique: true },
  // User's resource name according to Google People API
  userResourceName: { type: String, default: '' },
  // User's etag which is used for changing data
  etag: { type: String, default: ''},
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
 * Finds or creates a contact by email
 * If a user is not found in the database, we will check Google Contacts
 * If no contact is found in Google Contacts, we will create one and save
 * the data from the created contact into the database
 *
 * The important data to save is the etag, so that we can modify it later
 *
 * @param {string} email - email to add
 *
 * @return {Promise<Object, Error>} - a user object from the database, not from Contacts
 */
Contacts.findOrCreateContactByEmail = async (email) => {
  try {
    const user = await Contacts.findOne({ email })

    // If no user was found in the database
    if (!user) {
      const connectionOptions = {
        resourceName: 'people/me',
        personFields: 'emailAddresses,memberships',
      }
      const { connections } = ContactsAPI.people.connections.list(options)
      const matchingUser = connections.filter((each, i) => {
        let exists = false
        for (let i = 0; i < each.emailAddresses.length; i += 1) {
          if (email === each.emailAddresses[i]) {
            exists = true
            break;
          }
        }
        return exists
      })

      // If a user was found in Google Contacts
      if (matchingUser.length !== 0) {
        const sdcGroupResourceNames = matchingUser.memberships.map((each, i) => {
          return each.contactGroupMembership.contactGroupId
        })
        const options = {
          email,
          userResourceName: matchingUser.resourceName,
          etag: matchingUser.etag,
          sdcGroupResourceNames,
        }
        const newUser = await (new Contacts(options)).save()
        resolve(newUser)
      // Create a new contact and save the returned user into the database
      } else {
        const optionsForContacts = {
          emailAddresses: [{ value: email }],
        }
        const { resourceName, etag } = await ContactsAPI.people.createContact(optionsForContacts)
        const optionsForDb = { email, resourceName, etag }
        const newUser = await (new Contacts(optionsForDb)).save()
        resolve(newUser)
      }
    } else {
      resolve(user)
    }
  } catch (err) {
    reject(err)
  }
}

/**
 * Finds a group by a given name
 *
 * @param {string} name - unformatted name of the group
 * @return {Promise<Object, Error>} - resolves with the complete Contact Group Object
 */
Contacts.findOrCreateGroupByName = (name) => {
  return new Promise(async (resolve, reject) => {
    const formattedName = formatGroupName(name)
    const { contactGroups } = await ContactsAPI.contactGroups.list()
    const matchingGroups = contactGroups.filter((group) => {
      return group.formattedName === formattedName
    })

    if (matchingGroups.length !== 0) {
      resolve(matchingGroups[0])
    } else {
      const options = { contactGroup: { name: formattedName } }
      resolve(await ContactsAPI.contactGroups.create(options))
    }
  })
}

/**
 * Adds a user to the Contact Group - Cannot be Other - Other handled differently
 *
 * @param {string} userResourceName - the user's resourceName
 * @param {string} groupResourceName - the topic of interest
 * @param {string} otherTopic - given when the user wants a different topic
 *
 * @return {Promise<Object, Error>} - resolves with the complete Contact Group Object
 */
Contacts.addContactToGroup = (userResourceName, groupResourceName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        resourceName: groupResourceName,
        resourceNamesToAdd: [userResourceName]
      }
      await ContactsAPI.contactGroups.members.modify(options)
    } catch (err) {
      rejet(err)
    }
  })
}

/**
 * Deletes the user from the groups given
 *
 * @param {string} userResourceName - the user's resourceName
 * @param {string} groupResourceNames - the group to delete from
 */
Contacts.deleteContactfromGroup = (userResourceName, groupResourceName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        resourceName: groupResourceName,
        resourceNamesToRemoves: [userResourceName]
      }
      await ContactsAPI.contactGroups.members.modify(options)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Finds a group given a name, if one is not found, we will create one
 *
 * @param {string} name - name of the group to find
 * @return {Promise<Object, Error>} returns the resourceName for the group
 */
Contacts.findGroupByName = (name) => {
  const formattedName = formattedName(name)
  return new Promise(async (resolve, reject) => {
    try {
      // Check for existing group
      const { data } = await ContactsAPI.contactGroups.list()
      // The list of Groups
      const { contactGroups: listOfGroups } = data
      // Check for existing name
      const matchingGroups = listOfGroups.filter((group) => {
        return group.formattedName === formattedName
      })

      if (matchingGroups.length !== 0) {
        resolve(matchingGroups[0].resourceName)
      } else {
        const options = { requestBody: { contactGroup: { name: formattedName } } }
        const newGroup = await ContactsAPI.contactGroups.create(options)
        resolve(newGroup.resourceName)
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Replace the contact's interest groups in database based on their email
 *
 * @param {string} email - user's email
 * @param {Array<string>} groups - resource names for the groups
 *
 * @return {Promise<never>}
 */
Contacts.updateContactTopics = (email, groups) => {
  return new Promise(async (resolve, reject) => {
    await Contacts.findOneAndUpdate({ email }, { sdcGroupResourceNames: groups })
    resolve()
  })
}

/**
 * Formats the group name given to match the semester and year
 *
 * @param {string} groupName - the name for the group
 * @param {boolean} exact - whether or not to save the exact name of the group name
 */
const formatGroupName = (groupName, exact = true) => {
  let formattedName = groupName

  if (exact) {
    console.log('saving the exact name ', groupName)
  } else {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getYear()

    // May - December is considered Fall, everything else is Spring
    const season = currentMonth > 4 && currentMonth <= 11 ? 'Fall' : 'Spring'

    // Gets the last two digits of the year
    const year = currentYear.toString().slice(1, 3)

    formattedName = `SDC - ${groupName} - ${season} ${year}`
  }

  return formattedName
}
