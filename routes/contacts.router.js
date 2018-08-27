const express = require('express')

// Controller
const controller = require('../controllers/contacts.controller')

const router = express.Router()

/**
 * Adds the given email to the SDC Group with their interests as a label
 *
 * - Endpoint: `/contacts/add-to-google-group`
 * - Verb: PUT
 *
 * @param {object} req - Express Request Object
 * @param {string} req.body.topic - topic of interest
 * @param {string} req.body.topic - topic of interest
 *
 * @typedef {function} UserRouter-updateACMContactsGroup
 */
router.put('/add-to-google-group', async (req, res) => {
  try {
    const data = req.body;
    const GoogleContactsGroup = await controller.findGroupByName(data.topic)
    await controller.updateSDCGroup(data)
    await controller.addUserToInterestGroup(data)
    res.status(200).json({});
  } catch (err) {
    console.error(err)
    res.status(404).send();
  }
});

module.exports = router;
