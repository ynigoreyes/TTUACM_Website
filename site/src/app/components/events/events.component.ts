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
    this.events = results.json();
    this.lengthOfEvents = this.events.data.length;

    this.displayedEvents = this.events.data.slice(this.minNumberEvent, this.maxNumberEvent);
    });
  }

  getNextEvents() {
    if (this.maxNumberEvent < this.lengthOfEvents) {
      this.minNumberEvent += this.changeAmount;
      this.maxNumberEvent += this.changeAmount;
    } else {
      this.minNumberEvent = 0;
      this.maxNumberEvent = 10;
    }

    this.displayedEvents = this.events.data.slice(this.minNumberEvent, this.maxNumberEvent);
  }

  getPrevEvents() {
    if (this.minNumberEvent >= this.changeAmount) {
      this.minNumberEvent -= this.changeAmount;
      this.maxNumberEvent -= this.changeAmount;
    } else {
      this.minNumberEvent = this.lengthOfEvents - this.changeAmount;
      this.maxNumberEvent = this.lengthOfEvents;
    }
    this.displayedEvents = this.events.data.slice(this.minNumberEvent, this.maxNumberEvent);
  }

}
