const Contacts = require('../models/contacts.model')

async function addUserToGoogleContacts(email, topics, otherTopic) {
  try {
    // Find user from database
    const user = await Contacts.findOrCreateContactByEmail(email)

    // Delete user's previous group associations
    user.sdcGroupResourceNames.forEach(async (groupName) => {
      await Contacts.deleteContactfromGroup(user.userResourceName, groupName)
    })

    // Add all the new group associations
    topics.forEach(async (topic) => {
      if (['other', 'Other'].includes(topic)) {
      // TODO: addContactToOtherGroup
        finalGroups.push(await Contacts.addContactToOtherGroup(user.userResourceName, otherTopic))
      } else {
        const { resourceName: groupResourceName } = await Contacts.findOrCreateGroupByName(topic)
        finalGroups.push(await Contacts.addContactToGroup(user.userResourceName, groupResourceName))
      }
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
