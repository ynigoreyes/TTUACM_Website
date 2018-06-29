import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';

import * as jwt_decode from 'jwt-decode';
import { Profile } from '../../modules/explore/pages/profile/profile.component';

@Injectable()
export class UserStateService {
  constructor() {}

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
   * Set the globally available token string
   *
   * WARNING: CALLING THIS FUNCTION WILL CAUSE ERRORS IN SENDING AUTHENTICATED REQUESTS TO BACKEND
   * @param token The token given by the API which decodes to the user object
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

  public getUser(): Profile {
    let user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  /**
   * Sets the global user object
   * @param profile a user profile object
   */
  public setUser(profile?: Profile): Promise<any> {
    let user;
    return new Promise((resolve, reject) => {
      try {
        if (!profile) {
          let token = localStorage.getItem('id_token');
          user = jwt_decode(token);
        }
        localStorage.setItem('user', JSON.stringify(user.data || profile));
        resolve(user.data || profile);
      } catch (err) {
        reject(err);
      }
    });
  }

  public updateUser(newUser) {
    localStorage.setItem('user', JSON.stringify(newUser));
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
