import { Component } from '@angular/core';
import { Events } from '../../interfaces/Events.interface';
import { EventsService } from '../../services/events.service';
import { DeviceService } from '../../../../shared/services/device.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  public allEvents: Array<Events>;
  public displayedEvents: Array<Events>;
  public smallScreenSize: boolean;
  public loading: boolean = true;
  public error: boolean = false;

  public lengthOfEvents: number;
  public minNumberEvent: number;
  public maxNumberEvent: number;
  public changeAmount = 10;

  constructor(
    private snackbar: MatSnackBar,
    private eventService: EventsService,
    private deviceService: DeviceService
  ) { this.loadAllEvents(); }
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
        this.checkForSmallScreen();
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

  // Converts the date from the API into something readable
  public getTime(date) {
    let newDate = new Date(date);
    let hours = newDate.getHours();
    let minutes: any = newDate.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  // Converts the date into mm-dd-yyyy
  public getDate(date) {
    let newDate = new Date(date);
    let month = newDate.getMonth() + 1;
    let day = newDate.getDay();
    let year = newDate.getFullYear();
    return `${month}-${day}-${year}`;
  }

  public checkForSmallScreen(): void {
    let smallCheck: boolean;
    let xsmallCheck: boolean;
    this.deviceService.checkSmScreen().subscribe(status => {
      smallCheck = status.matches;
    });
    this.deviceService.checkXsScreen().subscribe(status => {
      xsmallCheck = status.matches;
    });
    this.smallScreenSize = smallCheck || xsmallCheck;
  }
}
