import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  public isSmallScreen: boolean;
  constructor() {
    this.isSmallScreen = window.innerWidth <= 425;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallScreen = event.target.innerWidth <= 425;
  }
}
