import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: Http) { }

  registerUser(newUser) {
    const headers = new Headers();
    headers.append('Content-type', 'application/json');

    // Add the map part
    const post = this.http.post('http://localhost:80/users/sign-up', newUser, {headers: headers})
      .map(res => res.json());

    return post;
  }
}
