import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: any;
  displayedEvents: any;

  lengthOfEvents: number;
  minNumberEvent: number;
  maxNumberEvent: number;
  changeAmount = 10;

  constructor(private http: Http) {
    this.http.get('http://localhost:80/events/get-events').subscribe((results) => {

    this.minNumberEvent = 0;
    this.maxNumberEvent = 10;
    // A Cache for all the events
    this.events = results.json().data;
    this.lengthOfEvents = this.events.length;

    // Current Events Displayed
    this.displayedEvents = this.events.slice(this.minNumberEvent, this.maxNumberEvent);
    });
  }

  /**
   * Gets the next 10 events in the calendar
   */
  getNextEvents() {
    if (this.maxNumberEvent < this.lengthOfEvents) {
      this.minNumberEvent += this.changeAmount;
      this.maxNumberEvent += this.changeAmount;
    } else {
      this.minNumberEvent = 0;
      this.maxNumberEvent = 10;
    }

    this.displayedEvents = this.events.slice(this.minNumberEvent, this.maxNumberEvent);
  }

  /**
   * Gets the prev 10 events in the calendar
   */
  getPrevEvents() {
    if (this.minNumberEvent >= this.changeAmount) {
      this.minNumberEvent -= this.changeAmount;
      this.maxNumberEvent -= this.changeAmount;
    } else {
      this.minNumberEvent = this.lengthOfEvents - this.changeAmount;
      this.maxNumberEvent = this.lengthOfEvents;
    }
    this.displayedEvents = this.events.slice(this.minNumberEvent, this.maxNumberEvent);
  }

}
