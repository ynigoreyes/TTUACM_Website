const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

  // JWT Strategy
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.session_secret
  };
  passport.use(
    new JwtStrategy(jwtOpts, (jwtPayload, done) => {
      User.getUserById(jwtPayload.data._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );

  // Google Strategy
  const googleClientID = process.env.google_clientID;
  const googleClientSecret = process.env.google_client_secret;
  const googleOpts = {
    // Change this callback URL in production
    callbackURL: '/auth/google/redirect',
    clientID: googleClientID,
    clientSecret: googleClientSecret
  };
  passport.use(
    new GoogleStrategy(googleOpts, (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // User exists in database
          done(null, currentUser);
        } else {
          // User does not exist... Create a new one
          const data = {
            googleId: profile.id,
            email: profile.email,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1],
            verified: true
          };
          const newUser = new User(data);
          newUser.save().then((user) => {
            done(null, user);
          });
        }
      });
    })
  );

  // GitHub Strategy
  const githubClientID = process.env.github_clientID;
  const githubClientSecret = process.env.github_client_secret;
  const githubOpts = {
    callbackURL: '/auth/github/redirect',
    clientID: githubClientID,
    clientSecret: githubClientSecret
  };
  passport.use(
    new GitHubStrategy(githubOpts, (accessToken, refreshToken, profile, done) => {
      User.findOne({ githubId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            // Sometimes, the user has their email access set to private
            // In that case, we save their id instead
            const emailData = profile._json.email === null ? profile.id : profile._json.email;
            const data = {
              githubId: profile.id,
              email: emailData,
              firstName: profile.displayName.split(' ')[0],
              lastName: profile.displayName.split(' ')[1],
              verified: true
            };
            const newUser = new User(data);
            newUser.save().then((user) => {
              done(null, user);
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
  );
  // Facebook Strategy
  const facebookClientID = process.env.facebook_clientID;
  const facebookClientSecret = process.env.facebook_client_secret;
  const facebookOpts = {
    callbackURL: '/auth/facebook/redirect',
    clientID: facebookClientID,
    clientSecret: facebookClientSecret,
    profileFields: ['id', 'emails', 'name']
  };
  passport.use(
    new FacebookStrategy(facebookOpts, (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            // Sometimes, the user has their email access set to private
            // In that case, we save their id instead
            const emailData = profile._json.email === null ? profile.id : profile._json.email;
            const data = {
              facebookId: profile.id,
              email: emailData,
              firstName: profile._json.first_name,
              lastName: profile._json.last_name,
              verified: true
            };
            const newUser = new User(data);
            newUser.save().then((user) => {
              done(null, user);
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
  );
};
