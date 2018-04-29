const request = require('request');
const expect = require('chai').expect;

const mongoose = require('mongoose');
const User = require('../models/user');
const config = require('../config/secrets');

// Bcrypt options
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const loginURL = 'http://localhost:80/users/login';
const logoutURL = 'http://localhost:80/users/logout';
const profileURL = 'http://localhost:80/users/profile';
const contactURL = 'http://localhost:80/users/contact-us';
const teamURL = 'http://localhost:80/users/get-team';
const registerURL = 'http://localhost:80/users/register';

const testUserData = { // eslint-disable-line
  email: 'testUserEmail@gmail.com',
  password: 'testUserPassword',
  firstName: 'testFirstName',
  lastName: bcrypt.hashSync('testLastName', 10),
  classification: 'Scrub',
};

describe('User Suite', () => {
  // Mock a user database
  before('Creating a Test User', () => {
    mongoose.connect(config.local_db, {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30
    });
    User.remove({}); // Empty Database

    return new Promise((resolve, reject) => {
      User.create(testUserData)
        .catch((err) => {
          console.log(err);
          reject(err);
        })
        .then((data) => {
          resolve(data);
        });
    });
  });

  // Not able to delete the user....
  after('Deleting the Test User', (done) => {
    User.deleteUserByEmail(testUserData.email, (err) => {
      console.log(err);
      done();
    });
  });

  describe('Login Test', () => {
    it('Returns a successful status code', (done) => {
      request.post(loginURL, (error, request) => {
        expect(request.statusCode).to.be.lessThan(399);
        done();
      });
    });

    it('Should return a valid user Object', (done) => {
      request({
        method: 'POST',
        uri: loginURL,
        multipart: {
          chunked: false,
          data: [
            {
              'content-type': 'application/json',
              body: JSON.stringify({
                email: testUserData.email,
                password: testUserData.password
              })
            }
          ]
        }
      }, (error, response, body) => {
        console.log('body: ', body);
        userObj = JSON.parse(body);
        expect(userObj.success, '').to.equal(true);
        expect(userObj).to.be.an('object');
        done();
      });
    });

  });
});
