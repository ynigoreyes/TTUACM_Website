/* eslint-disable */
const chaiHttp = require('chai-http');
const chai = require('chai');
const path = require('path');

const mongoose = require('mongoose');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
const User = require('../models/user.model');
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

const testUserData = {
  // eslint-disable-line
  email: 'testUserEmail@gmail.com',
  password: 'testUserPassword',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  classification: 'Scrub'
};

describe('User Suite', () => {
  before('Creating a Test User', done => {
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(
        process.env.db,
        {
          useMongoClient: true,
          socketTimeoutMS: 0,
          keepAlive: true,
          reconnectTries: 30
        }
      );
      done()
    });
  });
  it('Should attatch to testing suite', (done) => {
    expect(true).to.be.true;
    done();
  });
});
