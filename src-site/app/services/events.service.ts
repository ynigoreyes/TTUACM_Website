import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable()
export class EventsService {

  constructor(private http: HttpClient) { }
  getEventsEP: string = `${environment.host}/events`;

  public getEvents () {
    return this.http.get(this.getEventsEP);
  }

}
