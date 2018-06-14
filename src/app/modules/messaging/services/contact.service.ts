import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '@acm-environments/environment';

@Injectable()
export class ContactService {
  public ContactUsURL = `${environment.host}/users/contact-us`;
  constructor(private http: HttpClient) {}

  sendEmail(message: object) {
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ContactUsURL, message, { headers });
  }
}
