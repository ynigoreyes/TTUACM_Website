const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

/**
 * Uses a JWT stategy to verify the token
 *
 * @param {object} passport I'm not really sure. It's pretty magical tbh
 */
module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

  console.log(`Authentication configuration complete at ${Date().toString()}`);
  const _clientID = process.env.prod_clientID;
  const _clientSecret = process.env.prod_client_secret;

  // JWT Strategy
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

  // Google Strategy
  const googleOpts = {
    // Change this callback URL in production
    callbackURL: '/auth/google/redirect',
    clientID: _clientID,
    clientSecret: _clientSecret
  };
  passport.use(new GoogleStrategy(googleOpts, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then((currentUser) => {
      if (currentUser) {
        // user exists in database
        console.log('User Exists');
        done(null, currentUser);
      } else {
        // User does not exist... Create a new one
        const data = {
          googleId: profile.id,
          email: profile.id,
          firstName: profile.displayName.split(' ')[0],
          lastName: profile.displayName.split(' ')[1],
          verified: true
        };
        const newUser = new User(data);
        newUser.save().then((user) => {
          console.log(`Created new user: ${user}`);
          done(null, user);
        });
      }
    });
  }));
};
