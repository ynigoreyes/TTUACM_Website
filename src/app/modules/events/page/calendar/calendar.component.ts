import { Component, OnDestroy, HostListener } from '@angular/core';
import { Events } from '../../interfaces/Events.interface';
import { EventsService } from '../../services/events.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnDestroy {
  public allEvents: Array<Events>;
  public displayedEvents: Array<Events>;
  public loading: boolean = true;
  public error: boolean = false;

  public lengthOfEvents: number;
  public minNumberEvent: number;
  public maxNumberEvent: number;
  public changeAmount = 10;

  constructor(private snackbar: MatSnackBar, private eventService: EventsService) {
    this.loadAllEvents();
  }
  public loadAllEvents(): void {
    this.eventService.getEvents().subscribe(
      res => {
        this.minNumberEvent = 0;
        this.maxNumberEvent = 10;
        // A Cache for all the events
        this.allEvents = res['events'];
        this.lengthOfEvents = this.allEvents.length;
        // Current Events Displayed
        this.displayedEvents = this.allEvents.slice(this.minNumberEvent, this.maxNumberEvent);
        this.loading = false;
      },
      err => {
        this.loading = false;
        this.error = true;
        this.snackbar.open('Error occured when loading events.');
      }
    );
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

    this.displayedEvents = this.allEvents.slice(this.minNumberEvent, this.maxNumberEvent);
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
    this.displayedEvents = this.allEvents.slice(this.minNumberEvent, this.maxNumberEvent);
  }

  ngOnDestroy(): void {
    this.snackbar.dismiss();
  }
}
