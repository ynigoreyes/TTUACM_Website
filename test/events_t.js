const request = require('request');
const expect = require('chai').expect;

const getEventsUrl = 'http://localhost:80/events/get-events';

describe('Event Suite', () => {
  describe('Fetch User Data', () => {
    it('Returns a 200 status Code', (done) => {
      request(getEventsUrl, (error, response) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('Gets the events with usable properties', (done) => {
      request(getEventsUrl, (error, response, body) => {
        obj = JSON.parse(body);
        expect(obj.data[0]).to.have.property('title');
        expect(obj.data[0]).to.have.property('body');
        done();
      });
    });
  });
});
