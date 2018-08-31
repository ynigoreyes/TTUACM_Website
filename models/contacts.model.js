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
  return new Promise(async (resolve, reject) => {
    try {
      let userExistDb = false
      let userExistContacts = false

      // Check for existance of user in DB
      const user = await Contacts.findOne({ email })
      if (user) userExistDb = true

      // Check for existance of user in Contacts
      const connectionOptions = {
        resourceName: 'people/me',
        personFields: 'emailAddresses,memberships',
        pageSize: 2000
      }
      const { data } = await ContactsAPI.people.connections.list(connectionOptions)
      const matchingUser = data.connections.filter((each, i) => {
        let exists = false
        for (let i = 0; i < each.emailAddresses.length; i += 1) {
          if (email === each.emailAddresses[i].value) {
            exists = true
            console.log('equal')
            break;
          }
        }
        return exists
      })
      if (matchingUser.length > 0) userExistContacts = true

      let targetUser
      // Add the Contact to the db
      if (!userExistDb && userExistContacts) {
        if (matchingUser.length > 1) console.warn(`Warning, there are duplicate emails: ${email}`)
        console.log('cannot find user in db')
        const { resourceName, email, etag } = matchingUser[0]
        const sdcGroupResourceNames = matchingUser[0].memberships.map((each, i) => {
          return each.contactGroupMembership.contactGroupId
        })
        const options = {
          email,
          userResourceName: resourceName,
          etag,
          sdcGroupResourceNames,
        }
        const newUser = await (new Contacts(options)).save()
        targetUser = newUser.toObject()
      // Add the db user to Contacts and overwrite
      } else if (userExistDb && !userExistContacts) {
        console.log('cannot find user in Contacts')
        const { email: userEmail } = user
        const createContactOptions = {
          requestBody: {
            emailAddresses: [
              {
                value: userEmail
              }
            ]
          }
        }
        const { data } = await ContactsAPI.people.createContact(createContactOptions)
        const query = { email: userEmail }
        const update = {
          etag: data.etag,
          userResourceName: data.resourceName
        }
        const options = { new: true }
        const newUser = await Contacts.findOneAndUpdate(query, update, options)
        targetUser = newUser.toObject()
      // Create a contact and save to database
      } else if (!userExistDb && !userExistContacts) {
        console.log('cannot find user anywhere')
        const createContactOptions = {
          requestBody: {
            emailAddresses: [
              {
                value: email
              }
            ]
          }
        }
        const { data } = await ContactsAPI.people.createContact(createContactOptions)
        const options = {
          email,
          etag: data.etag,
          userResourceName: data.resourceName
        }
        const newUser = await (new Contacts(options)).save()
        targetUser = newUser.toObject()
      } else {
        console.log('user is everywhere!')
        targetUser = user
      }
      resolve(targetUser)
    } catch (err) {
      reject(err)
    }
  })
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
    const { data } = await ContactsAPI.contactGroups.list()
    const matchingGroups = data.contactGroups.filter((group) => {
      return group.formattedName === formattedName
    })

    if (matchingGroups.length !== 0) {
      resolve(matchingGroups[0])
    } else {
      const options = {
        requestBody: {
          contactGroup: {
            name: formattedName
          }
        }
      }
      const { data: group } = await ContactsAPI.contactGroups.create(options)
      resolve(group)
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
        requestBody: {
          resourceNamesToAdd: [userResourceName]
        }
      }
      await ContactsAPI.contactGroups.members.modify(options)
      console.log(`Added ${userResourceName} to ${groupResourceName}`)
      resolve()
    } catch (err) {
      reject(err)
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
        requestBody: {
          resourceNamesToRemove: [userResourceName]
        }
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
        const options = {
          requestBody: {
            contactGroup: {
              name: formattedName
            }
          }
        }
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
    console.log('updating db...')
    // TODO: not updating groups
    try {
      const query = { email }
      const update = { sdcGroupResourceNames: groups }
      const options = { new: true }
      const updatedUser = await Contacts.findOneAndUpdate(query, update, options)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Formats the group name given to match the semester and year
 *
 * @param {string} groupName - the name for the group
 * @param {boolean} exact - whether or not to save the exact name of the group name
 */
const formatGroupName = (groupName, exact = false) => {
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
