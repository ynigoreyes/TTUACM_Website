import { Component, ViewChild, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { AuthService } from './modules/user-auth/services/auth.service';
import { DeviceService } from './shared/services/device.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public deviceService: DeviceService
  ) {
    this.saveToken();
  }

  ngOnInit(): void {
    if (!environment.production) {
      console.log('Running in development...');
    }
  }

  private saveToken(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.token) {
        const user = jwt_decode(params.token);
        this.authService.storeUserData(params.token, user.data);
      }
    });
  }

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
