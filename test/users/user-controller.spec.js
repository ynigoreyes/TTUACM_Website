const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const db = require('../db-config');
const test = require('./user.mocks');

const controller = require('../../controllers/user.controller');

const expect = chai.expect;
const assert = chai.assert;
const should = chai.should;

describe('User Controller Suite', () => {
  describe('#login', () => {
    before(async () => {
      // Save a user into the mockgoose database
      await db.createTestConnection();
      await db.saveTestUser();
      await db.saveVerifiedTestUser();
    });
    it('Should allow a user to log in', () => {
      // Work around. The user saved in database seems to be passed by reference
      const email = 'testUser3Email@gmail.com';
      const password = 'testUser3Password';
      return controller.login(email, password).then((payload) => {
        expect(payload.token).to.not.be.null;
        expect(payload.foundUser).to.not.be.null;
      });
    });
    it('Should reject a user for having an invalid login', () => {
      const email = 'SomeRandomEmail';
      const password = 'WrongPassword';
      return controller.login(email, password).catch((err) => {
        expect(err.message).to.equal('User Not Found');
      });
    });
    it('Should reject a user that is not verified', () => {
      const email = 'testUserEmail@gmail.com';
      const password = 'testUserPassword';
      return controller.login(email, password).catch((err) => {
        expect(err.message).to.equal('User Not Verified');
      });
    });
    it('Should reject a verified user that gave an invalid password', () => {
      const email = 'testUser3Email@gmail.com';
      const password = 'wrongPassword';
      return controller.login(email, password).catch((err) => {
        expect(err.message).to.equal('Invalid Login');
      });
    });
    after(async () => {
      await db.reset();
    });
  });
});
