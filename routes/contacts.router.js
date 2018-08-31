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
 * TODO: Add route guarding after dev
 */
router.put('/', async (req, res) => {
  try {
    const { email, topics, otherTopic } = req.body
    // if (!email || !topics || !otherTopic) throw new Error('Missing required variable')
    await ctrl.addUserToGoogleContacts(email, topics, otherTopic)
    res.status(200).end()
  } catch (err) {
    console.error(err.errors[0].message)
    res.status(err.code || 404).json({ err: err.message })
  }
});

module.exports = router;
