import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventsService {
  private PORT: string = '8080';

  constructor(private http: HttpClient) { }
  getEventsEP: string = `http://localhost:${this.PORT}/events/`;

  public getEvents () {
    return this.http.get(this.getEventsEP);
  }

}
