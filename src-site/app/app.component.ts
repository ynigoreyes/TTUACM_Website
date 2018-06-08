import { Component, ViewChild, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { DeviceService } from './shared/services/device.service';
import { UserStateService } from './shared/services/user-state.service';

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
    public userStateService: UserStateService,
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
        this.userStateService.setUser(user);
      }
    });
  }

  logout() {
    this.userStateService.logOut();
    this.router.navigate(['/login']);
    return false;
  }
}
