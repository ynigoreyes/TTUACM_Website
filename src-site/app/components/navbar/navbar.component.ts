import { Component, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { UserStateService } from '../../shared/services/user-state.service';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public isSmallDevice: boolean;
  public openDrawer: boolean = false;
  constructor(
    private router: Router,
    public state: UserStateService,
    public device: DeviceService
  ) {
    this.isSmallDevice = window.innerWidth <= 425;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallDevice = event.target.innerWidth <= 425;
  }

  toggleDrawer(): void {
    if (this.openDrawer === false) {
      this.openDrawer = true;
    } else {
      this.openDrawer = false;
    }
  }
}
