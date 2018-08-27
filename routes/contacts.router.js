const express = require('express')

// Controller
const controller = require('../controllers/contacts.controller')

const router = express.Router()

/**
 * Single Endpoint for front end
 * Adds the given email to the SDC Group with their interests as a label
 *
 * - Endpoint: `/contacts/add-to-google-group`
 * - Verb: PUT
 *
 * @param {object} req - Express Request Object
 * @param {string} req.body.email - user's email
 * @param {string} req.body.topic - topic of interest
 *
 * @typedef {function} ContactsRouter-updateSDCGroup
 * @typedef {function} ContactsRouter-updateUsersInterestGroup
 */
router.put('/add-to-google-group', async (req, res) => {
  try {
    const data = req.body;
    const GoogleContactsGroup = await controller.findGroupByName(data.topic)
    const user = await controller.findContactByEmail(req.body.email)
    // Add to SDC group if not there yet
    await controller.updateSDCGroup(user)
    // Update the user's interestGroup association
    await controller.updateUsersInterestGroup(data)
    res.status(200).json({});
  } catch (err) {
    console.error(err)
    res.status(404).send();
  }
});

module.exports = router;
