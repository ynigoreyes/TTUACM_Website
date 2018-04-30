import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  public open() {
    this.sidenav.open();
  }

  public close() {
    this.sidenav.close();
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(['/login']);
    return false;
  }
}
