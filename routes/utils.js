const passport = require('passport');

/**
 * Middleware for route guarding
 * If errors occur, it is probably because front-end is not sending
 * JWT along with their requests
 */
const membersOnlyRoute = passport.authenticate('jwt', { session: false })

module.exports = {
  membersOnlyRoute
}
