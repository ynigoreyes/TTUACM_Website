import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventsService {

  constructor(private http: HttpClient) { }
  getEventsEP: string = 'http://localhost:80/events/get-events';

  // TODO: Make these routes and see if it would be better to just
  // Put some logic in the routes instead of making endpoints for all
  // of the different buttons
  attendingEventsEP: string = 'http://localhost:80/events/attending-events';
  maybeEventsEP: string = 'http://localhost:80/events/maybe-attending-events';
  notAttendingEventsEP: string = 'http://localhost:80/events/not-attending-events';

  public getEvents () {
    return this.http.get(this.getEventsEP);
  }

  public attendingEvent(user, event) {
    console.log('Attending');
  }

  public maybeEvent(user, event) {
    console.log('Maybe Attending');
  }

  public notAttendingEvent(user, event) {
    console.log('Not Attending');
  }

}
