import { Component, Input, HostListener } from '@angular/core';

export interface IEvent {
  attendees: Array<Object>;
  creator: string;
  day: string;
  description: string;
  endTime: string;
  eventId: string;
  id: number;
  location: string;
  startTime: string;
  title: string;
}

@Component({
  selector: 'app-event-cards',
  templateUrl: './event-cards.component.html',
  styleUrls: ['./event-cards.component.scss']
})
export class EventCardsComponent {
  @Input() event: IEvent;
  public isSmallScreen: boolean;

  constructor() {
    this.isSmallScreen = window.innerWidth < 426;
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
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    return `${month}-${day}-${year}`;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallScreen = event.target.innerWidth < 426;
  }
}
