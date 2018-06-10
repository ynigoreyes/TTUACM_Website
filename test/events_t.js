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
  it('Should respond with an array of valid events', (done) => {
    chai.request(localhost)
      .get(eventsURL)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.body.events, 'No longer an array of events').to.be.an('array');
        expect(res.body.events[0].startTime, 'No start time available').to.not.be.undefined;
        expect(res.body.events[0].endTime, 'No end time available').to.not.be.undefined;
        expect(res.body.events[0].title, 'No title available').to.not.be.undefined;
        expect(res.body.events[0].location, 'No location available').to.not.be.undefined;
        expect(res.body.events[0].creator, 'Creator not given').to.not.be.undefined;
        expect(res.body.events[0].description, 'No description').to.not.be.undefined;
        done();
      });
  })
});