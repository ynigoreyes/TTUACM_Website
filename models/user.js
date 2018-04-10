/*
* NOTE:@param SALT_FACTOR is different in some functions so that salted/hashed
*     passwords can not be cross referenced in case of a database failure.
*/

var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var userSchema = mongoose.Schema({
  local: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    classification: String,
    confirmEmailToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hasPaidDues: Boolean,
    verified: Boolean
  }
})

// This function is saltier than the Salty Spitoon
userSchema.pre('save', function (next) {
  var user = this
  var SALT_FACTOR = 5

  if (!user.isModified('local.password')) return next()

  // Make some salt
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err)

    // Sprinkle the salt
    bcrypt.hash(user.local.password, salt, null, function (err, hash) {
      if (err) return next()
      user.local.password = hash
      next()
    })
  })
})

// Make some more salt, but throw some sand in this batch
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// Separate the salt and sand
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

// Verify email address using token
userSchema.methods.verify = function (token, done) {
  this.local.confirmEmailToken = undefined
  this.local.verified = true
  this.save(function (err) {
    done(err)
  })
}

module.exports = mongoose.model('User', userSchema);
