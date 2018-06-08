import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserStateService {
  constructor() {}

  // User observable
  private userSubject = new BehaviorSubject<object>({});
  public currentUser$ = this.userSubject.asObservable();

  // Email observable
  private userEmail = new BehaviorSubject<string>(`No Email`);
  public currentEmail$ = this.userEmail.asObservable();

  // Token observable
  private userToken = new BehaviorSubject<string>(`No Token`);
  public currentToken$ = this.userToken.asObservable();

  /**
   * Set the globally available user object
   * @param email email of a logged in user
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
   * @param user The user object
   */
  public setUser(user: object): void {
    this.userSubject.next(user);
  }

  /**
   * Set the globally available token string
   * @param token The token given by the API
   */
  public setToken(token: string) {
    localStorage.setItem('id_token', token);
    this.userToken.next(token);
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
  }
}
