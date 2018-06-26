import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserStateService {
  constructor() {}

  // User Subject
  public userObject = new BehaviorSubject<object>({});

  // Email Subject
  public userEmail = new BehaviorSubject<string>(`No Email`);

  // Token Subject
  public userToken = new BehaviorSubject<string>(`No Token`);

  // Confirm Token Subject
  public HEXToken = new BehaviorSubject<string>(`No HEX Token`);

  /**
   * Set the globally available user object
   * @param email valid email of a logged in user
   */
  public setEmail(email: string): void {
    this.userEmail.next(email);
  }

  /**
   * Sets the globally available user object
   * @example
   *  email: string,
   *  firstName: string,
   *  lastName: string
   * @param user A valid user object
   */
  public setUser(user: object): void {
    this.userObject.next(user);
  }

  /**
   * Set the globally available token string
   * @param token The token given by the API
   */
  public setToken(token: string): void {
    localStorage.setItem('id_token', token);
    this.userToken.next(token);
  }

  /**
   * Set the globally available token string
   * @param token The token given by the API
   */
  public setHEXToken(token: string): void {
    this.HEXToken.next(token);
  }

  /**
   * Checks the local storage for an token and checks if it is a valid token
   * @returns {boolean} false if the token is valid, true if the token is not
   */
  public loggedIn(): boolean {
    return tokenNotExpired('id_token');
  }

  /**
   * Clears the local storage of the JWT to log the user out
   */
  public logOut(): void {
    localStorage.clear();
    this.userToken.next('To Token');
  }
}
