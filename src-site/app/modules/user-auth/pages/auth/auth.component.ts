import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public isSmallDevice: boolean;
  constructor(
    private route: ActivatedRoute
  ) {
    this.isSmallDevice = window.innerWidth <= 556;
    this.route.queryParamMap.subscribe((params) => {
      console.log(params);
    });
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallDevice = event.target.innerWidth <= 556;
    console.log(this.isSmallDevice);
  }
}
