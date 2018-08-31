const Contacts = require('../models/contacts.model')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function addUserToGoogleContacts(email, topics, otherTopic) {
  return new Promise(async (resolve, reject) => {
    try {
      const finalGroups = [] // Will hold all of the resource names for requested topics
      // Find user from database
      const user = await Contacts.findOrCreateContactByEmail(email)

      // Delete user's previous group associations
      for (const groupName of user.sdcGroupResourceNames) {
        const missing = await Contacts.deleteContactfromGroup(user.userResourceName, groupName)
        if (missing) console.error(`Cannot find contact ${missing[0]}`)
      }

      // Add all the new group associations
      for (const topic of topics) {
        let groupResourceName

        if (['other', 'Other'].includes(topic)) {
          const { resourceName } = await Contacts.findOrCreateGroupByName('Other', exact = true)
          // TODO: Send ACM emails of topic requests
          // await Contacts.sendGroupRequest(otherTopic, email)
          groupResourceName = resourceName
        } else {
          const { resourceName } = await Contacts.findOrCreateGroupByName(topic)
          groupResourceName = resourceName
        }
        console.log('found/created group:', groupResourceName)

        await sleep(5000)

        const missing = await Contacts.addContactToGroup(user.userResourceName, groupResourceName)
        if (missing) console.error(missing)
        console.log(`pushing ${groupResourceName} to array`)
        finalGroups.push(groupResourceName)
      }

      // update Contacts Model
      await Contacts.updateContactTopics(email, finalGroups)

      resolve('Contact has been saved and editted successfully')
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  addUserToGoogleContacts,
}
