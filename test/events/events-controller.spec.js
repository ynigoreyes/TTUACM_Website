/* eslint-disable */
const chai = require('chai');
const sinonChai = require('sinon-chai');
const controller = require('../../controllers/event.controller');
const auth = require('../../config/oauth2.config.js');

chai.use(sinonChai);
const expect = chai.expect;

let fakeAttendees;
let lengthOfStub = 2;

// We are not going to test against our real Google Calendar because that is just way too risky
describe('Events Controller Suite', () => {
  before('Get creds to access the calendar and create the calendar', done => {
    auth.loadCredentials().then(() => done());
  });
  beforeEach('Reset the value for stub', () => {
    fakeAttendees = [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }];
  });
  describe('#listEvents()', () => {
    it('Should return a list of valid/formmated events', () => {
      return controller.listEvents().then(listOfEvents => {
        expect(listOfEvents).to.be.an('array');
        if (listOfEvents.length !== 0) {
          console.log('Testing the event object');
          let test = listOfEvents[0];
          expect(test).to.not.be.undefined;
          expect(test.id).to.be.a('number');
          expect(test.startTime).to.not.be.undefined;
          expect(test.title).to.not.be.undefined;
          expect(test.location).to.not.be.undefined;
          expect(test.creator).to.not.be.undefined;
          expect(test.description).to.not.be.undefined;
          expect(test.eventId).to.not.be.undefined;
        }
      });
    });
  });
  describe('#addAttendee(currentAttendees, email)', () => {
    it('Should add an attendee given a email and ID for the event', () => {
      return controller.addAttendee(fakeAttendees, 'fakeEmail@gmail.com').then(updatedList => {
        expect(updatedList).to.have.lengthOf(lengthOfStub + 1);
      });
    });
  });
  describe('#removeAttendee(currentAttendees, email)', () => {
    it('Should remove an attendee given a email and ID for the event', () => {
      return controller
        .removeAttendee(fakeAttendees, 'lpage@example.com')
        .then(async updatedList => {
          expect(updatedList).to.have.lengthOf(lengthOfStub - 1);
        });
    });
  });
});
