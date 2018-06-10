/* eslint-disable */
const chaiHttp = require('chai-http');
const chai = require('chai');
const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('dotenv').config({ path: path.resolve('.env') });

const expect = chai.expect;

// Test Router Setup
chai.use(chaiHttp);

// Node Endpoints
const localhost = `http://localhost:${process.env.PORT}`;
const eventsURL = `/events`

describe('Events/Google Calendar Suite', () => {
  it('Should attatch to testing suite', (done) => {
    expect(true).to.be.true;
    done();
  })
});