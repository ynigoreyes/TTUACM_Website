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
    const { email, topics, otherTopic } = req.body
    await ctrl.addUserToGoogleContacts(email, topics, otherTopic)
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(404).json({ err })
  }
});

module.exports = router;
