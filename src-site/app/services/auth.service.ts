import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
// import { BehaviourSubject } from 'rxjs/BehaviourSubject';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthService {
  private authToken: string = 'default';
  private user: object; // Change this to a behavior subject

  private signUpEP: string = `${environment.host}/users/register`;
  private loginEP: string = `/${environment.host}users/login`;
  private forgotEP: string = `/${environment.host}users/forgot`;
  private resetEP: string = `/${environment.host}users/reset`;
  private confirmationEP: string = `/${environment.host}users/confirmation`;
  constructor(private http: HttpClient) { }

  // User observable
  private userObs = new BehaviorSubject<object>({});
  public currentUserObs = this.userObs.asObservable();

  // Email observable
  private userEmail = new BehaviorSubject<string>(`No Email`);
  public currentEmail = this.userEmail.asObservable();

  public registerUser(newUser) {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');

    // Add the map part
    const post = this.http.post(this.signUpEP, newUser, { headers: headers });

    return post;
  }

  // Allows the email to be sent around
  public setEmail(message: string): void {
    this.userEmail.next(message);
  }

  // Allows us to update the user globaly
  public setUser(user: object): void {
    this.userObs.next(user);
  }

  /**
   * This will attempt to login the user
   * @param existingUser A valid login attempt
   */
  public authenticateUser(existingUser): Observable<object> {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');

    const post = this.http.post(this.loginEP, existingUser, { headers: headers });

    return post;
  }

  /**
   * TODO: Change this to be compatible with observables, but only the user.
   * The token must be set in local storage to keep a session going
   * Runs when the user logs in correctly
   * @param token The token given by the API
   * @param user The user that just logged in; similar to a session... I think
   */
  public storeUserData(token, user) {
    localStorage.setItem('id_token', token);

    this.authToken = token;
    this.user = user;
  }

  public setToken(token) {
    localStorage.setItem('id_token', token);
  }

  /**
   * Grabs the token from the local storage
   */
  public loadToken() {
    const token: string = localStorage.getItem('id_token');
    this.authToken = token;
  }

  private getToken() {
    this.loadToken();
    return this.authToken;
  }

  /**
   * Checks the local storage for an token and checks if it is a valid token
   * @returns {boolean} false if the token is valid, true if the token is not
   */
  public loggedIn() {
    return tokenNotExpired('id_token');
  }

  /**
   * Clears the local storage so that the JWT is no longer available until
   * they log in again
   */
  public logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  /**
   * Sends to fogot login endpoint which accepts only an email in the body
   */
  public forgotUser(userEmail): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    const post = this.http.post(this.forgotEP, {email: userEmail}, { headers: headers });

    return post;
  }

  /**
   * Hits the reset POST endpoint and changes the user's password
   * @param password The new password to be replaced
   * @param token The hex token that will be used for identification
   */
  public resetPassword(userPassword, token): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    return this.http.post(
      `${this.resetEP}/${token}`,
      {password: userPassword}, {headers: headers});

  }

  public sendConfirmation(email): Observable<object> {
    const headers = new HttpHeaders;
    headers.append(`Content-type`, `application/json`);

    const post: Observable<object> = this.http.post(this.confirmationEP, email, { headers: headers });

    return post;
  }


}
