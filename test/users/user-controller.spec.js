/* eslint-disable */
const chai = require('chai');
const sinonChai = require('sinon-chai');
const db = require('../db-config');
const test = require('./user.mocks');
const controller = require('../../controllers/user.controller');

chai.use(sinonChai);
const expect = chai.expect;

describe('User Controller Suite', () => {
  before(async () => {
    await db.createTestConnection();
  });
  describe('#login(email, password)', () => {
    before(async () => {
      // Save a user into the mockgoose database
      await db.saveTestUser();
      await db.saveVerifiedTestUser();
    });
    it('Should allow a user to log in', () => {
      // Work around. The user saved in database seems to be passed by reference
      const email = 'testUser3Email@gmail.com';
      const password = 'testUser3Password';
      return controller.login(email, password).then(payload => {
        expect(payload.token).to.not.be.null;
        expect(payload.foundUser).to.not.be.null;
      });
    });
    it('Should reject a user for having an invalid login', () => {
      const email = 'SomeRandomEmail';
      const password = 'WrongPassword';
      return controller.login(email, password).catch(err => {
        expect(err.message).to.equal('User Not Found');
      });
    });
    it('Should reject a user that is not verified', () => {
      const email = 'testUserEmail@gmail.com';
      const password = 'testUserPassword';
      return controller.login(email, password).catch(err => {
        expect(err.message).to.equal('User Not Verified');
      });
    });
    it('Should reject a verified user that gave an invalid password', () => {
      const email = 'testUser3Email@gmail.com';
      const password = 'wrongPassword';
      return controller.login(email, password).catch(err => {
        expect(err.message).to.equal('Invalid Login');
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  describe('#register(user)', () => {
    before(async () => {
      await db.reset();
    });
    it('Should successfully register a new user', () => {
      return controller.register(test.user001).then(user => {
        expect(user).to.not.be.null;
      });
    });
    it('Should not be able register a new user with the same email', () => {
      return controller.register(test.user001).catch(err => {
        expect(err.message).to.equal('unavailable');
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  describe('#forgotLogin(email)', () => {
    before(async () => {
      await db.saveTestUser();
    });
    it('Should find the user and return a HEX token', () => {
      const email = test.user001.email;
      return controller.forgotLogin(email).then(payload => {
        expect(payload.token).to.not.be.null;
        expect(payload.user).to.not.be.null;
      });
    });
    it('Should reject with an error if the email was not found', () => {
      const email = 'SomeRandomEmail';
      return controller.forgotLogin(email).catch(err => {
        expect(err.message).to.not.be.null;
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  describe('#sendResetEmail and sendConfirmationEmail(token, email, req)', () => {
    let token;
    let email;
    let req;
    before(done => {
      process.env.NODE_ENV = 'Whatever';
      done();
      token = '5743290574902750';
      email = 'fakeEmail@gmail.com';
      req = {
        headers: {
          host: 'SomeHostName'
        },
        protocol: 'SomeProtocol'
      };
    });
    it('Should send an email without errors, even to a fake email', () => {
      expect(process.env.NODE_ENV).to.not.equal('test');
      return controller.sendResetEmail(token, email, req).then(() => {
        expect(true).to.be.true;
      });
    });
    it('Should send an email using sendConfirmationEmail without errors, even to a fake email', () => {
      expect(process.env.NODE_ENV).to.not.equal('test');
      return controller.sendChangedPasswordEmail(email, token, req).then(() => {
        expect(true).to.be.true;
      });
    });
    after(done => {
      process.env.NODE_ENV = 'test';
      done();
    });
  });
  describe('#sendChangedPasswordEmail(email)', () => {
    before(done => {
      process.env.NODE_ENV = 'Whatever';
      done();
    });
    it('Should send an email without error', () => {
      expect(process.env.NODE_ENV).to.not.equal('test');
      const email = 'fakeEmail@gmail.com';
      return controller.sendChangedPasswordEmail(email).then(() => {
        expect(true).to.be.true;
      });
    });
    after(done => {
      process.env.NODE_ENV = 'test';
      done();
    });
  });
  describe('Reset Password Sequence (#resetPassword)', () => {
    let payload;
    let password;
    let email;
    before(async () => {
      await db.saveTestUser();
      email = 'testUserEmail@gmail.com';
      password = 'NewUserPasswordToReplaceTheOldOne';
      payload = await controller.forgotLogin(email);
    });
    it('#verifyUser(token, passwordAttempt)', () => {
      return controller.verifyUser(payload.token, password).then(user => {
        expect(user).to.not.be.null;
        expect(user.password).to.not.equal('testUserPassword');
      });
    });
    after(async () => {
      db.reset();
    });
  });
  describe('Confirm Account Sequence', () => {
    let user;
    before(async () => {
      user = await db.saveVerifiedTestUser();
    });
    it('Should find the user and update their status to verified: true', () => {
      return controller.confirmToken(user.confirmEmailToken).then(user => {
        expect(user.verified).to.equal(true);
        expect(user.confirmEmailToken).to.equal('');
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  describe('#updateResume(id, path)', () => {
    let user;
    const path = 'resume/update-path.jpg';
    before(async () => {
      user = await db.saveVerifiedTestUser();
    });
    it('Should find the user and update their resume', () => {
      return controller.updateResume(user._id, path).then(user => {
        expect(user.resume).to.equal(path);
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  describe('#updateUser(user)', () => {
    let user;
    let originalId;
    let newEmail = 'AnotherEmail@gmail.com';
    let newClassification = 'AnotherClassification';
    before(async () => {
      user = await db.saveVerifiedTestUser();
      originalId = user._id;
      user.email = newEmail;
      user.classification = newClassification;
    });
    it('Should find the user and update their object completely', () => {
      return controller.updateUser(user).then(updatedUser => {
        expect(updatedUser.email).to.equal(newEmail);
        expect(updatedUser.classification).to.equal(newClassification);
        expect(updatedUser._id.toString()).to.equal(originalId.toString());
      });
    });
    after(async () => {
      await db.reset();
    });
  });
  after(async () => {
    await db.reset();
  });
});
