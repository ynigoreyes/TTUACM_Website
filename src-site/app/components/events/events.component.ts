import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  public events: any;
  public displayedEvents: any;

  public lengthOfEvents: number;
  public minNumberEvent: number;
  public maxNumberEvent: number;
  public changeAmount = 10;

  constructor(private eventService: EventsService) {
    this.eventService.getEvents().subscribe((results) => {

    this.minNumberEvent = 0;
    this.maxNumberEvent = 10;
    // A Cache for all the events
    this.events = results['data'];
    this.lengthOfEvents = this.events.length;

    // Current Events Displayed
    this.displayedEvents = this.events.slice(this.minNumberEvent, this.maxNumberEvent);
    });
  }

  /**
   * Gets the next 10 events in the calendar
   */
  public getNextEvents() {
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
  public getPrevEvents() {
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
