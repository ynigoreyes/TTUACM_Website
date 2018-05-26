/* eslint-disable */
const chaiHttp = require('chai-http');
const chai = require('chai');
const path = require('path');

const mongoose = require('mongoose');
const User = require('../models/user');
mongoose.Promise = global.Promise;

// Bcrypt options
const bcrypt = require('bcryptjs');
const saltRounds = 10;

require('dotenv').config({ path: path.resolve('.env') });

const expect = chai.expect;

// Test Router Setup
chai.use(chaiHttp);


// Node Endpoints
const localhost = `http://localhost:${process.env.PORT}`;
const loginURL = '/users/login';
const logoutURL = '/users/logout';
const profileURL = '/users/profile';
const contactURL = '/users/contact-us';
const teamURL = '/users/get-team';
const registerURL = '/users/register';
const forgotURL = '/users/forgot';

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
    User.remove({})
      .then(
        chai.request(localhost)
          .post(registerURL)
          .set('Content-Type', 'application/json')
          .send(testUserData)
          .end((err, res) => {
            if (res.body.success === true) {
              done();
            }
          })
      );
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
          expect(res.body.token, tokenError).to.be.of.length.greaterThan(15);
          expect(res.body.success).to.be.true;

          // Checks for a required email
          expect(res.body.user, objectError).to.be.an('object');
          expect(res.body.user.email, emailError).to.not.be.null
          expect(res.body.user.email, emailError).to.not.be.undefined
          expect(res.body.user.email).to.equal(testUserData.email)

          // Checks for absence of error
          expect(err).to.be.null;
          done();
        });
    });
  });

  describe('Forgot Password Test', () => {
    it('Returns a valid endpoint when given an email', (done) => {
      chai.request(localhost)
        .post(forgotURL)
        .set('Content-Type', 'application/json')
        .send({
          // A fake email, but should still send
          email: testUserData.email
        })
        .end((err, res) => {
          // Fails the test, but succeeds IRL
          expect(res.body.success, 'Failed in sending').to.be.true;
          expect(res.body.recipient, 'Null value for user... Probaby did not find it').to.be.an('object')
        });
    });
  });

  after('Deleting the Test User', (done) => {
    User.remove({}).then(done());
  });
});
