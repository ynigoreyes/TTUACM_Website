import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';

describe('AuthService', () => {
  const TestUserObject: object = {
    firstName: 'Miggy',
    lastName: 'Reyes',
    email: 'email@gmail.com',
    confirmPassword: 'password',
    classification: 'Freshman'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [AuthService]
    });
  });

  it('Test Should be running...', inject([AuthService], (service: AuthService) => {
    expect(true).toBeTruthy();
  }));
});
