const jwt = require('jsonwebtoken');
const querystring = require('querystring');

/**
 * Redirects user to homepage after logging in with OAuth2
 *
 * @param {object} req request object
 * @param {object} res response object
 */
function oauth2(req, res) {
  const token = jwt.sign({ data: req.user }, process.env.session_secret, {
    expiresIn: 604800, // 1 week
  });

  const qs = querystring.stringify({
    token: `JWT ${token}`
  });

  // The port should change depending on the environment
  res.redirect(`${process.env.CLIENT || ''}/?${qs}`);
}

module.exports = {
  oauth2
};
