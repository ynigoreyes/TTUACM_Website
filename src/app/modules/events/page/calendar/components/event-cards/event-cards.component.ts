import { Component, Input, HostListener, OnInit } from '@angular/core';
import { UserStateService } from '@acm-shared/services/user-state.service';
import { Profile } from '../../../../../explore/pages/profile/profile.component';
import { EventsService } from '../../../../services/events.service';
import { MatSnackBar } from '@angular/material';

export interface IEvent {
  attendees: Array<Object>;
  creator: string;
  day: string;
  description: string;
  endTime: string;
  eventId: string;
  location: string;
  startTime: string;
  title: string;
  allDayEvent: boolean;
}

@Component({
  selector: 'app-event-cards',
  templateUrl: './event-cards.component.html',
  styleUrls: ['./event-cards.component.scss']
})
export class EventCardsComponent implements OnInit {
  @Input() ACMevent: IEvent;
  public profile: Profile;
  public isSmallScreen: boolean;
  public attending: boolean;
  public attendeeEmails: Array<Object>;
  public waiting: boolean = false;

  constructor(
    public state: UserStateService,
    public eventService: EventsService,
    public sb: MatSnackBar
  ) {
    this.isSmallScreen = window.innerWidth < 426;
  }

  ngOnInit(): void {
    if (this.state.loggedIn()) {
      this.attendeeEmails =
        this.ACMevent.attendees.map(el => {
          return el['email'];
        }) || [];
      this.checkAttendance();
    }
  }

  public checkAttendance() {
    this.attending = this.attendeeEmails.includes(this.state.getUser().email);
  }

  public getDay(date) {
    let newDate = new Date(date);
    switch (newDate.getDay()) {
      case(0):
        return 'Sunday';
      case(1):
        return 'Monday';
      case(2):
        return 'Tuesday';
      case(3):
        return 'Wednesday';
      case(4):
        return 'Thursday';
      case(5):
        return 'Friday';
      case(6):
        return 'Saturday';
      default:
        return 'TBD';
    }
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
    let day = this.ACMevent.allDayEvent ? newDate.getDate() + 1 : newDate.getDate();
    let year = newDate.getFullYear();
    return `${month}-${day}-${year}`;
  }

  public getLongDate(date) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    let newDate = new Date(date);
    let month = months[newDate.getMonth()];
    let day = this.ACMevent.allDayEvent ? newDate.getDate() + 1 : newDate.getDate();
    return `${month} ${day}`;
  }

  // Toggles Attendance
  toggleAttendance() {
    // So it looks fast, when really all the work is being done in the background
    this.attending = !this.attending;
    this.waiting = true;
    let email = this.state.getUser().email.toLowerCase(); // Google makes all emails lowercase

    // You were going, but you changed your mind
    if (this.attending === true) {
      console.log('Adding...');
      this.eventService.addAttendee(email, this.ACMevent.eventId).subscribe(
        () => {
          this.attendeeEmails.push(email);
        },
        err => {
          console.error(err);
          this.sb.open('Internal Server Error. Please try again later', 'Close', {
            duration: 2000
          });
          this.attending = false; // Revert
        },
        () => {
          this.waiting = false;
        }
      );
      // You weren't going to begin with and now you are coming
    } else if (this.attending === false) {
      console.log('Removing...');
      this.eventService.removeAttendee(email, this.ACMevent.eventId).subscribe(
        () => {
          this.attendeeEmails.pop();
        },
        err => {
          console.error(err);
          this.sb.open('Internal Server Error. Please try again later', 'Close', {
            duration: 2000
          });
          this.attending = true; // Revert
        },
        () => {
          this.waiting = false;
        }
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallScreen = event.target.innerWidth < 426;
  }
}
