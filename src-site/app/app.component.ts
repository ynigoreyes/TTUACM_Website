import { Component, ViewChild, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import * as jwt_decode from 'jwt-decode';
import { DeviceService } from './services/device.service';
import { environment } from '../environments/environment';

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
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.token) {
        const user = jwt_decode(params.token);
        this.authService.storeUserData(params.token, user.data);
      }
    });
    if (!environment.production) {
      console.log('Running in development...');
    }
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
