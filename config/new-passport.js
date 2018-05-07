const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

/**
 * Uses a JWT stategy to verify the token
 *
 * @param {object} passport I'm not really sure. It's pretty magical tbh
 */
module.exports = (passport) => {
  console.log(`Authentication configuration complete at ${Date().toString()}`);
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = process.env.session_secret;
  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.getUserById(jwtPayload.data._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    });
  }));
};
