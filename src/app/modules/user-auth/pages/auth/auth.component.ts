import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public isSmallDevice: boolean;
  constructor() {
    this.isSmallDevice = window.innerWidth <= 556;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallDevice = event.target.innerWidth <= 556;
  }
}
