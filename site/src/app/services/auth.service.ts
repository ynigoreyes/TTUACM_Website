import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  signUpRoute: string = 'http://localhost:80/users/register';
  // signUpRoute: string = 'http://localhost:80/users/signup';
  loginRoute: string = 'http://localhost:80/users/login';
  getProfileRoute: string = 'http//localhost:80/users/profile';

  constructor(private http: Http) { }

  registerUser(newUser) {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    // Add the map part
    const post = this.http.post(this.signUpRoute, newUser, {headers: headers})
      .map(res => res.json());

    return post;
  }

  /**
   * This will attempt to login the user
   * @param existingUser A valid login attempt
   */
  authenticateUser(existingUser) {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    const post = this.http.post(this.loginRoute, existingUser, {headers: headers})
      .map(res => res.json());

    return post;
  }

  /**
   * Runs when the user logs in correctly
   * @param token The token given by the API
   * @param user The user that just logged in; similar to a session... I think
   */
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  /**
   * Grabs the token from the local storage
   */
  loadToken() {
    const token: any = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  getProfile(id) {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    const post = this.http.get(`${this.getProfileRoute}/${id}`, {headers: headers})
      .map(res => res.json());

    return post;
  }
}
