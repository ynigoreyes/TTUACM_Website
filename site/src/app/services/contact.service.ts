import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactService {
  message: any;

  constructor(private http: Http) { }

  sendEmail(message) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    const post = this.http.post('http://localhost:80/users', message, { headers: headers })
    .map(res => res.json());

    return post;
  }

}
