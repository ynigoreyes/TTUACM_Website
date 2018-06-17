const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const path = require('path');
const User = require('../models/user.model');
const request = require('supertest');
const app = require('../app.js');
const test = require('./users/user.mocks');
const bcryptjs = require('bcryptjs');

const saltRounds = 10;

const mockgoose = new Mockgoose(mongoose);
require('dotenv').config({ path: path.join(__dirname, '../.env') });

mongoose.Promise = global.Promise;

function createTestConnection() {
  return new Promise((resolve, reject) => {
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        process.env.db,
        {
          useMongoClient: true,
          socketTimeoutMS: 0,
          keepAlive: true,
          reconnectTries: 30
        },
        (err) => {
          if (err) reject(err);
          resolve('Connection to mockgoose completed');
        }
      );
    });
  });
}

/**
 * Saves user001 into the database as a test
 *
 * @returns {Promise.<null, Error>} Rejects: an error. Resolves: the new user object
 */
function saveTestUser() {
  return new Promise((resolve) => {
    request(app)
      .post('/api/users/register')
      .send(test.user001)
      .expect(201)
      .end((err, res) => {
        resolve(res.body.user);
      });
  });
}

/**
 * Saves a user into the database a as a test
 *
 * @returns {Promise.<null, Error>} Rejects: an error or msg if no user was created
 */
function saveVerifiedTestUser() {
  return new Promise((resolve) => {
    const data = {
      email: 'testUser3Email@gmail.com',
      password: 'testUser3Password',
      firstName: 'testFirstName3',
      lastName: 'testLastName3',
      classification: 'MoreMeme',
      verified: true
    };
    data.password = bcryptjs.hashSync(data.password, saltRounds);
    verifiedUser = new User(data);
    verifiedUser.save((err, user) => {
      resolve(user);
    });
  });
}

function reset() {
  return new Promise((resolve) => {
    mockgoose.helper.reset().then(resolve());
  });
}

module.exports = {
  createTestConnection,
  saveVerifiedTestUser,
  saveTestUser,
  reset
};
