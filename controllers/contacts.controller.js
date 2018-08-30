const Contacts = require('../models/contacts.model')

async function addUserToGoogleContacts(email, topics, otherTopic) {
  try {
    // Find user from database
    const user = await Contacts.findOrCreateContactByEmail(email)

    // Delete user's previous group associations
    user.sdcGroupResourceNames.forEach(async (groupName) => {
      // TODO: deleteContactfromGroup
      await Contacts.deleteContactfromGroup(user.userResourceName, groupName)
    })

    // Add all the new group associations
    topics.forEach(async (topic) => {
      // TODO: addContactToGroup
      finalGroups.push(await Contacts.addContactToGroup(user.userResourceName, topic, otherTopic))
    })

    // update Contacts Model
    // TODO: updateContactTopics
    await Contacts.updateContactTopics(topics)

    resolve('Contact has been saved and editted successfully')
  } catch (err) {
    reject(err)
  }
}

module.exports = {
  addUserToGoogleContacts,
}
