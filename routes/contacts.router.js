const express = require('express')
const { membersOnlyRoute } = require('./utils')

// Controller
const ctrl = require('../controllers/contacts.controller')

const router = express.Router()

router.get('/hello-world', (req, res) => {
  console.log('hello world')
  res.json({ msg: 'Hello World!' })
})

/**
 * Single Endpoint for front end
 * Adds the given email to the SDC Group with their interests as a label
 *
 * - Restricted
 * - Endpoint: `/contacts/add-to-google-group`
 * - Verb: PUT
 *
 * @requires Authentication - JWT
 * @param {object} req - Express Request Object
 * @param {string} req.body.email - user's email
 * @param {string} req.body.topics - array of topic of interests
 * @param {string} req.body.otherTopic - user's request for a topic
 *
 */
router.put('/add-to-google-group', membersOnlyRoute, async (req, res) => {
  let initalGroups; // Array of group resource names
  const finalGroups = []
  try {
    // Find user from database
    const { email, topics, otherTopic } = req.body
    const user = await ctrl.findOrCreateContactByEmail(email)
    initalGroups = user.sdcGroupResourceNames // Save for error handling

    // Delete user's previous group associations
    user.sdcGroupResourceNames.forEach(async (groupName) => {
      await ctrl.deleteContactfromGroup(user.userResourceName, groupName)
    })

    // Add all the new group associations
    topics.forEach(async (topic) => {
      finalGroups.push(await ctrl.addContactToGroup(user.userResourceName, topic, otherTopic))
    })

    // update Contacts Model
    await ctrl.updateContactTopics(topics)

    res.status(200).end()
  } catch (err) {
    console.error(err)
    ctrl.updateContactTopics(initalGroups) // Reset contact's topics
    res.status(404).json({ err })
  }
});

module.exports = router;
