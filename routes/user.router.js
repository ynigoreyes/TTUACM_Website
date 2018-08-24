const express = require('express');
const passport = require('passport');
const querystring = require('querystring');

// Controller
const controller = require('../controllers/user.controller');

const router = express.Router();

/**
 * Middleware for route guarding
 * If errors occur, it is probably because front-end is not sending
 * JWT along with their requests
 */
const membersOnlyRoute = passport.authenticate('jwt', { session: false });

// Routes pertaining to the user's account

/**
 * Registers the user and saved them as a unverified user
 *
 * - endpoint: `/users/register`
 * - Verb: POST
 *
 * OnFailure: Sends an error message
 * OnSuccess: Sends the user back as JSON
 *
 * @typedef {function} UserRouter-register
 *
 */
router.post('/register', async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    classification: req.body.classification,
    confirmEmailToken: null
  };
  try {
    const createdUser = await controller.register(user);
    await controller.sendConfirmationEmail(createdUser.email, createdUser.confirmEmailToken, req);
    res.status(201).json({ user });
  } catch (err) {
    if (err.message === 'unavailable') {
      res.status(401).json({ emailAvailable: false });
    } else {
      res.status(404).json({ err });
    }
  }
});

/**
 * JWT Login/Authentication
 * User must not have signed up using OAuth2
 *
 * - endpoint: `/users/login`
 * - Verb: POST
 *
 * OnFailure: Sends an error message
 * OnSuccess: Sends the JWT Token of the user
 *
 * @typedef {function} UserRouter-login
 */
router.post('/login', (req, res) => {
  const email = req.body.email;
  const inputPassword = req.body.password;
  controller.login(email, inputPassword)
    .then((response) => {
      const token = response.token;
      const user = response.foundUser;
      res.status(200).json({ token: `JWT ${token}`, user, msg: null });
    })
    .catch((err) => {
      const errors = ['Invalid Login', 'User Not Verified', 'User Not Found'];
      if (errors.indexOf(err.message) === -1) {
        console.log(err.message);
      }
      res.status(404).json({ token: null, user: null, msg: err.message });
    });
});

/**
 * Confirms the user has a valid email account
 *
 * - endpoint: `users/confirm/:token`
 * - VERB: GET
 *
 * OnFailure: Redirects to error page
 * OnSuccess: Redirects to the login page with querystring to signal a notification
 *
 * @typedef {function} UserRouter-confirmToken
 * @param {querystring} token - HEX token saved in confirmEmailToken
 */
router.get('/confirm/:token', (req, res) => {
  controller.confirmToken(req.params.token)
    .then(() => {
      const qs = querystring.stringify({ verify: 'success' });
      res.redirect(`${process.env.CLIENT}/auth/?${qs}`);
    })
    .catch((err) => {
      console.log('Error Occured');
      console.log(err);
      const qs = querystring.stringify({ err: 'Error Validating Email' });
      res.redirect(`${process.env.CLIENT}/?${qs}`);
    });
});

/**
 * Resends the confirmation email to the requested user
 *
 * - endpoint: `/users/confirm`
 * - VERB: POST
 *
 * OnFailure: Tells the user that the email has failed to send
 * OnSuccess: Sends a successful status code
 *
 * @typedef {function} UserRouter-sendConfirmationEmail
 */
router.post('/confirm', (req, res) => {
  controller.sendConfirmationEmail(req.body.email, req.body.token, req)
    .then(() => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({});
    });
});

/**
 * Verifies that the user is resetting the password of an account they own
 *
 * - endpoint: `/users/forgot`
 * - Verb: POST
 *
 * OnFailure: Sends an internal server error message
 * OnSuccess: Sends the user that the email was sent to
 *
 * @typedef {function} UserRouter-forgotLogin
 * @param {string} req.body.email - Email for the account that needs to change passwords
 */
router.post('/forgot', async (req, res) => {
  try {
    const email = req.body.email;
    const payload = await controller.forgotLogin(email);
    await controller.sendResetEmail(payload.token, payload.user.email, req);
    res.status(200).json({ recipient: payload.user, msg: null });
  } catch (err) {
    console.log(err);
    res.status(404).json({ recipient: null, msg: err.message });
  }
});

/**
 * This endpoint is hit by an email to reset a user password
 * This endpoint is hit first in the sequence
 *
 * - endpoint: `/users/reset/:token`
 * - Verb: GET
 *
 * OnFailure: Redirects to the login screen with an error in query string
 * OnSuccess: Redirects to the forgot-redirect page to change password
 *
 * @typedef {function} UserRouter-resetToken
 * @param {string} token - A string that contains the HEX code/Reset token of a lost account
 */
router.get('/reset/:token', (req, res) => {
  controller.resetToken(req.params.token)
    .then((token) => {
      const qs = querystring.stringify({ token });
      res.redirect(`${process.env.CLIENT}/auth/forgot/redirect/?${qs}`);
    })
    .catch((err) => {
      const qs = querystring.stringify({ err });
      res.redirect(`${process.env.CLIENT}/auth/?${qs}`);
      console.log(err);
    });
});

/**
 * Angular hits this endpoint with a token and a new password to update the account with
 *
 * - Endpoint: `/users/reset/:token`
 * - Verb: POST
 *
 * OnFailure: Sends a success status code
 * OnSuccess: Sends a error status code
 *
 * @typedef {function} UserRouter-resetPassword
 */
router.post('/reset/:token', (req, res) => {
  controller.resetPassword(req.params.token, req.body.password)
    .then((user) => {
      res.status(200).json({user});
    })
    .catch((err) => {
      res.status(404).json({user: null});
    });
});

/**
 * Gets the user's profile to fill in a profile page
 * This route requires authentication
 *
 * - endpoint: `/users/profile`
 * - Verb: GET
 *
 * OnFailure: Sends an error statuscode
 * OnSuccess: Sends a success statuscode with an user Object
 *
 * @typedef {function} UserRouter-getProfile
 */
router.get('/profile', membersOnlyRoute, (req, res) => {
  controller.getProfile(req.user.email)
    .then((user) => {
      res.status(200).json({ user, err: null });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ user: null, err });
    });
});

/**
 * Updates the user's resume
 * This route requires authentication
 *
 * - endpoint: `/users/update-resume`
 * - Verb: PUT
 *
 * OnFailure: Sends an error statuscode
 * OnSuccess: Sends a success statuscode with an user Object
 * @deprecated - Use `/users/update-user`
 * @typedef {function} UserRouter-updateResume
 */
router.put('/update-resume', membersOnlyRoute, (req, res) => {
  controller.updateResume(req.user._id, req.body.path)
    .then((user) => {
      res.status(200).json({ user, err: null });
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ user: null, err });
    });
});

/**
 * Updates the user's information completely
 * This route requires authentication
 *
 * - endpoint: `/users/update-user`
 * - Verb: PUT
 *
 * OnFailure: Sends an error statuscode
 * OnSuccess: Sends a success statuscode with an user Object
 *
 * @typedef {function} UserRouter-updateUser
 * @param {object} req.body.user A New User object with a ObjectID
 */
router.put('/update-user', membersOnlyRoute, (req, res) => {
  controller.updateUser(req.body.user)
    .then((payload) => {
      res.status(200).json(
        {
          user: payload.user,
          token: payload.token,
          err: null
        }
      );
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json(
        {
          user: null,
          token: null,
          err
        }
      );
    });
});

/**
 * Sends and question to ACM Email
 *
 * - Endpoint: `/users/contact-us`
 * - Verb: POST
 *
 * @typedef {function} UserRouter-contactUs
 */
router.post('/contact-us', (req, res) => {
  const emailInfo = {
    name: req.body.name,
    email: req.body.email,
    topic: req.body.topic,
    message: req.body.message
  };
  controller.contactUs(emailInfo)
    .then(() => res.status(200).json())
    .catch(err => res.status(404).json());
});

/**
 * Adds the given email to the SDC Group with their interests as a label
 *
 * - Endpoint: `/users/add-to-google-group`
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
