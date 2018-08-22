const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  googleId: { type: String, default: '' },
  facebookId: { type: String, default: '' },
  githubId: { type: String, default: '' },
  profileImage: {type: String, default: ''},
  resume: { type: String, default: '' },
  email: { type: String, required: true },
  password: { type: String, required: false, default: null },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  classification: { type: String, required: true, default: 'Other' },
  confirmEmailToken: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: null },
  hasPaidDues: { type: String, default: false },
  verified: { type: Boolean },
  blocked: { type: Boolean, default: false },
  sdcTeam: { type: String, default: 'None' }
});

// Moved the Hashing to the controller
const User = module.exports = mongoose.model('Students', userSchema);

// Bellow are query methods for the User Model
// We passback the password in the callback so that we can check
// to see if it matches in the controller
// The reason for this is becuase we may not allways need to hash
// a password when looking for a user

/**
 * This will find the user by the ID
 * @param {string} id The Mongo Id we are going to find
 * @param {boolean, object} done (err, user)
 */
module.exports.getUserById = (id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
      done(err, false);
    } else {
      done(null, user);
    }
  });
};

/**
 * This will find the user by the email
 * @param {string} email The email we are going to find
 * @param {done} done (err, user)
 */
module.exports.getUserByEmail = (userEmail, done) => {
  User.findOne({ email: userEmail }, (err, user) => {
    if (err) {
      console.log(err);
      done(err, null);
    } else if (user === null) {
      done(null, null);
    } else {
      done(null, user);
    }
  });
};

/**
 * Gives a list of all the users in the database as an object
 * @param {boolean, object} callback (err, user)
 */
module.exports.findAllUsers = (callback) => {
  User.find((err, users) => {
    if (err) {
      callback(({ success: false, user: null }));
    } else {
      data = users.map((users) => {
        return {
          firstName: users.firstName,
          lastName: users.lastName,
          classification: users.classification
        };
      });
      callback(({ success: true, user: users }));
    }
    return null;
  });
};

/**
 * OAuth2 Google Account Merge
 *
 * Checks to see if there is already a user that has the recieved
 * Google ID. If there is a user, we just log them in. If there is
 * not a user with that Google ID, we check for an email that
 * matches the email from the data passed back from Google and try
 * to merge the accounts. If there is no email, a new account
 * is made.
 * @param {Object} profile OAuth2 Profile
 * @param {Object} data Data object that will be passed
 * @param {string} authProvider OAuth2Provider [Google, GitHub, Facebook]
 */
module.exports.mergeAccounts = (profile, data, authProvider, callback) => {
  User.findOne({ email: profile.email }, (err, existingUser) => {
    if (err) {
      callback(err, null);
    } else if (existingUser) {
      existingUser[authProvider] = profile.id;
      existingUser.save().then((user) => {
        callback(null, user);
      });
    } else {
      const newUser = new User(data);
      newUser.save().then((user) => {
        callback(null, user);
      });
    }
  });
};

module.exports.deleteUserByEmail = (userEmail) => {
  User.deleteOne({ email: userEmail }, (err) => {
    if (err) {
      console.log(err);
      console.log('Could Not find User. Aborting query...');
    }
    return err;
  });
};
