import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public isSmallDevice: boolean;
  constructor(
  ) {
    this.isSmallDevice = window.innerWidth <= 556;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallDevice = event.target.innerWidth <= 556;
    console.log(this.isSmallDevice);
  }
}
