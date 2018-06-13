import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
// import { BehaviourSubject } from 'rxjs/BehaviourSubject';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthService {
  private signUpEP: string = `${environment.host}/users/register`;
  private loginEP: string = `${environment.host}/users/login`;
  private forgotEP: string = `${environment.host}/users/forgot`;
  private resetEP: string = `${environment.host}/users/reset`;
  private confirmationEP: string = `${environment.host}/users/confirmation`;
  constructor(private http: HttpClient) {}

  public registerUser(newUser) {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');

    // Add the map part
    const post = this.http.post(this.signUpEP, newUser, { headers: headers });

    return post;
  }

  /**
   * This will attempt to login the user
   * @param existingUser A valid login attempt
   */
  public authenticateUser(existingUser): Observable<object> {
    const headers = new HttpHeaders();
    headers.append('Content-type', 'application/json');
    return this.http.post(this.loginEP, existingUser, { headers: headers });
  }

  /**
   * Sends to fogot login endpoint which accepts only an email in the body
   */
  public forgotUser(userEmail): Observable<object> {
    const headers = new HttpHeaders();
    headers.append(`Content-type`, `application/json`);

    return this.http.post(this.forgotEP, { email: userEmail }, { headers: headers });
  }

  /**
   * Hits the reset POST endpoint and changes the user's password
   * @param password The new password to be replaced
   * @param token The hex token that will be used for identification
   */
  public resetPassword(userPassword, token): Observable<object> {
    const headers = new HttpHeaders();
    headers.append(`Content-type`, `application/json`);

    return this.http.post(
      `${this.resetEP}/${token}`,
      { password: userPassword },
      { headers: headers }
    );
  }

  public sendConfirmation(email): Observable<object> {
    const headers = new HttpHeaders();
    headers.append(`Content-type`, `application/json`);

    const post: Observable<object> = this.http.post(this.confirmationEP, email, {
      headers: headers
    });

    return post;
  }
}
