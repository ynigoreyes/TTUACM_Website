import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventsService {

  constructor(private http: HttpClient) { }
  getEventsEP: string = `/events/`;

  public getEvents () {
    return this.http.get(this.getEventsEP);
  }

}
