import { Component, HostListener } from '@angular/core';
import { UserStateService } from '../../shared/services/user-state.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public isSmallDevice: boolean;
  public openDrawer: boolean = false;
  constructor(public state: UserStateService, public snackbar: MatSnackBar) {
    this.isSmallDevice = window.innerWidth <= 425;
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event) {
    this.isSmallDevice = event.target.innerWidth <= 425;
  }

  /**
   * Opens the drawer when the screen is small
   */
  toggleDrawer(): void {
    this.openDrawer = !this.openDrawer;
  }

  /**
   * Deletes the token in local storage and notifies the user
   */
  logout(): void {
    this.state.logOut();
    this.snackbar.open('You have logged out successfully', 'Close', {
      duration: 2000
    });
  }
}
