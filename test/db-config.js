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
 * @returns {Promise.<null, Error>} Rejects: an error or msg if no user was created
 */
function saveTestUser() {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/users/register')
      .send(test.user001)
      .expect(201)
      .end((err, res) => {
        resolve();
      });
  });
}

/**
 * Saves a user into the database a as a test
 *
 * @returns {Promise.<null, Error>} Rejects: an error or msg if no user was created
 */
function saveVerifiedTestUser() {
  return new Promise((resolve, reject) => {
    const data = test.verifiedUser001;
    data.password = bcryptjs.hashSync(data.password, saltRounds);
    verifiedUser = new User(data);
    verifiedUser.save((err, user) => {
      resolve();
    });
  });
}

function reset() {
  return new Promise((resolve, reject) => {
    mockgoose.helper.reset().then(resolve());
  });
}

module.exports = {
  createTestConnection,
  saveVerifiedTestUser,
  saveTestUser,
  reset
};
