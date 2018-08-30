const Contacts = require('../models/contacts.model')

async function addUserToGoogleContacts(email, topics, otherTopic) {
  try {
    const finalGroups = [] // Will hold all of the resource names for requested topics
    // Find user from database
    const user = await Contacts.findOrCreateContactByEmail(email)

    // Delete user's previous group associations
    user.sdcGroupResourceNames.forEach(async (groupName) => {
      const missing = await Contacts.deleteContactfromGroup(user.userResourceName, groupName)
      if (missing) console.error(missing)
    })

    // Add all the new group associations
    topics.forEach(async (topic) => {
      let groupResourceName

      if (['other', 'Other'].includes(topic)) {
        const { resourceName } = await Contacts.findOrCreateGroupByName('SDC - Other')
        // TODO: Send ACM emails of topic requests
        // await Contacts.sendGroupRequest(otherTopic, email)
        groupResourceName = resourceName
      } else {
        const { resourceName } = await Contacts.findOrCreateGroupByName(topic)
        groupResourceName = resourceName
      }

      const missing = await Contacts.addContactToGroup(user.userResourceName, groupResourceName)
      if (missing) console.error(missing)
      finalGroups.push(groupResourceName)
    })

    // update Contacts Model
    await Contacts.updateContactTopics(email, finalGroups)

    resolve('Contact has been saved and editted successfully')
  } catch (err) {
    reject(err)
  }
}

module.exports = {
  addUserToGoogleContacts,
}
