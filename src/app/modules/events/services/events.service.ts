import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@acm-environments/environment';

@Injectable()
export class EventsService {
  constructor(private http: HttpClient) {}
  private getEventsEP: string = `${environment.host}/api/events`;
  private addAttendeeEP: string = `${environment.host}/api/events/attendee`;
  private removeAttendeeEP: string = `${environment.host}/api/events/remove-attendee`;

  public getEvents() {
    return this.http.get(this.getEventsEP);
  }

  public addAttendee(email, eventID) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('id_token')
    });
    const post = this.http.patch(`${this.addAttendeeEP}/${eventID}`, { email }, { headers });

    return post;
  }

  public removeAttendee(email, eventID) {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: localStorage.getItem('id_token')
    });
    const post = this.http.patch(`${this.removeAttendeeEP}/${eventID}`, { email }, { headers });

    return post;
  }
}
