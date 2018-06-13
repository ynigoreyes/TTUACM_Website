import { TestBed, inject } from '@angular/core/testing';

import { UserStateService } from './user-state.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { User } from '../../modules/user-auth/models/UserPost';
import * as jwt from 'jsonwebtoken';
import { HttpClientModule } from '@angular/common/http';

const validUser = {
  firstName: 'ValidFirstName',
  lastName: 'ValidLastName',
  email: 'ValidEmail@gmail.com',
  classification: 'Freshman'
};
describe('UserStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UserStateService]
    });
  });

  it('Should instantiate correctly as a service', inject([UserStateService], (service: UserStateService) => {
    expect(service).toBeTruthy();
  }));

  it('should update email', inject([UserStateService], (service: UserStateService) => {
    service.setEmail(validUser.email);
    expect(service.userEmail.getValue()).toEqual(validUser.email, 'Email was not set correctly');
  }));

  it('should update current user', inject([UserStateService], (service: UserStateService) => {
    service.setUser(validUser);
    expect(service.userObject.getValue()).toEqual(validUser, 'User was not set correctly');
  }));

  it('should update valid token', inject([UserStateService], (service: UserStateService) => {
    const secret = 'HelloWorldThisIsMySecret';
    service.setToken(
      jwt.sign(validUser, secret, {
        expiresIn: 1000 * 60 * 5 // 5 minutes
      })
    );
    const token = localStorage.getItem('id_token');
    expect(token).not.toBeNull('Could not find a token');
  }));

  afterEach(inject([UserStateService], (service: UserStateService) => {
    service.setEmail('No Email');
    service.setToken('No Token');
    service.setUser({});
  }));
});
