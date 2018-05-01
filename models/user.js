const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  classification: { type: String, required: true },
  confirmEmailToken: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: null },
  hasPaidDues: { type: String, default: false },
  verified: { type: String, default: false },
  bio: { type: String, default: '' }
});

// Moved the Hashing to the controller
const User = module.exports = mongoose.model('User', userSchema);

// Bellow are query methods for the User Model
// We passback the password in the callback so that we can check
// to see if it matches in the controller
// The reason for this is becuase we may not allways need to hash
// a password when looking for a user

/**
 * This will find the user by the ID
 * @param {string} id The Mongo Id we are going to find
 * @param {boolean, object} callback (err, user)
 */
module.exports.getUserById = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
      callback(err, false);
    } else {
      callback(null, user);
    }
  });
};

/**
 * This will find the user by the email
 * @param {string} email The email we are going to find
 * @param {callback} callback (err, user)
 */
module.exports.getUserByEmail = (userEmail, callback) => {
  User.findOne({ email: userEmail }, (err, user) => {
    if (err) {
      console.log(err);
      callback(err, null);
    } else if (user === null) {
      callback(null, null);
    } else {
      callback(null, user);
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

// Verify email address using token
User.verify = function (token, done) {
  this.local.confirmEmailToken = undefined;
  this.local.verified = true;
  this.save(function (err) {
    done(err);
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
