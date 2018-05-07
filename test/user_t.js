/* eslint-disable */
const chaiHttp = require('chai-http');
const chai = require('chai');
const path = require('path');

const mongoose = require('mongoose');
const User = require('../models/user');

// Bcrypt options
const bcrypt = require('bcryptjs');
const saltRounds = 10;

require('dotenv').config({ path: path.resolve('.env') });

const expect = chai.expect;

// Test Router Setup
chai.use(chaiHttp);


// Node Endpoints
const localhost = 'http://localhost:80';
const loginURL = '/users/login';
const logoutURL = '/users/logout';
const profileURL = '/users/profile';
const contactURL = '/users/contact-us';
const teamURL = '/users/get-team';
const registerURL = '/users/register';

const testUserData = { // eslint-disable-line
  email: 'testUserEmail@gmail.com',
  password: 'testUserPassword',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  classification: 'Scrub',
};

describe('User Suite', () => {
  before('Creating a Test User', (done) => {
    mongoose.connect(process.env.dev_db, {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    });

    chai.request(localhost)
      .post(registerURL)
      .set('Content-Type', 'application/json')
      .send(testUserData)
      .end((err, res) => {
        if (res.body.success === true) {
          done();
        }
      });
  });

  after('Deleting the Test User', (done) => {
    User.remove({}).then(done());
  });

  describe('Login Test', () => {
    it('Returns a successful status code and a valid Token', (done) => {
      chai.request(localhost)
        .post(loginURL)
        .set('Content-Type', 'application/json')
        .send({
          email: testUserData.email,
          password: testUserData.password
        })
        .end((err, res) => {
          const objectError = 'Response is not an object';
          const emailError = 'Email is not valid (null/undefined)'
          const tokenError = 'Token is empty'

          // Checks for valid tokens and success status
          expect(res.body.token, tokenError).to.not.be.null;
          expect(res.body.token, tokenError).to.be.of.length.greaterThan(1);
          expect(res.body.success).to.be.true;

          // Checks for a required email
          expect(res.body.user, objectError).to.be.an('object');
          expect(res.body.user.email, emailError).to.not.be.null
          expect(res.body.user.email, emailError).to.not.be.undefined
          // Checks for absence of error
          expect(err).to.be.null;
          done();
        });
    });
  });
});
