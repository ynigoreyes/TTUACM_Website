import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactService {
  message: any;

  constructor(private http: HttpClient) { }

  sendEmail(message) {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    const post = this.http.post('http://localhost:80/users/contact-us', message, { headers: headers });

    return post;
  }
}
