/* eslint-disable */
const chai = require('chai');
const path = require('path');
const User = require('../../models/user.model');
const request = require('supertest');
const app = require('../../app.js');
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const expect = chai.expect;

mongoose.Promise = global.Promise;

// Bcrypt options
const bcrypt = require('bcryptjs');
const saltRounds = 10;

require('dotenv').config({ path: path.resolve('.env') });

// Node Endpoints
const loginURL = '/users/login';
const logoutURL = '/users/logout';
const profileURL = '/users/profile';
const contactURL = '/users/contact-us';
const teamURL = '/users/get-team';
const registerURL = '/users/register';
const forgotURL = '/users/forgot';

const testUserData = {
  email: 'testUserEmail@gmail.com',
  password: 'testUserPassword',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  classification: 'Scrub'
};

const testUserData2 = {
  email: 'testUser2Email@gmail.com',
  password: 'testUser2Password',
  firstName: 'testFirstName2',
  lastName: 'testLastName2',
  classification: 'Meme'
};

const testUserData3 = {
  email: 'testUser3Email@gmail.com',
  password: 'testUser3Password',
  firstName: 'testFirstName3',
  lastName: 'testLastName3',
  classification: 'MoreMeme',
  verified: true
};

describe('User Suite', () => {
  describe('Login Funcitonality', () => {
    beforeEach('Save a test user into the database', done => {
      mockgoose.helper.reset();
      mockgoose.prepareStorage().then(() => {
        mongoose.connect(
          process.env.db,
          {
            useMongoClient: true,
            socketTimeoutMS: 0,
            keepAlive: true,
            reconnectTries: 30
          },
          async () => {
            testUserData.password = bcrypt.hashSync(testUserData.password, saltRounds);
            testUserData3.password = bcrypt.hashSync(testUserData3.password, saltRounds);
            const testUser = new User(testUserData);
            const testUser3 = new User(testUserData3);
            try {
              await testUser.save();
              await testUser3.save();
              done();
            } catch (err) {
              console.log(err);
              throw err;
            }
          }
        );
      });
    });
    it('Should reject a non-existing user', done => {
      expect(mockgoose.helper.isMocked()).to.be.true;
      request(app)
        .post(loginURL)
        .send(testUserData2)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.msg).to.equal('User Not Found');
          done();
        });
    });
    it('Should reject a non-verified user', done => {
      expect(mockgoose.helper.isMocked()).to.be.true;
      request(app)
        .post(loginURL)
        .send(testUserData)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.msg).to.equal('User Not Verified');
          done();
        });
    });
    it('Should allow verified user to log in and pass a token', () => {
      expect(mockgoose.helper.isMocked()).to.be.true;
      request(app)
        .post(loginURL)
        .send(testUserData3)
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          expect(res.body.token).to.exist;
        });
    });
  });
});
