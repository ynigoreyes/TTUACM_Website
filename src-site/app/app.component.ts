import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './services/auth.service';
import * as jwt_decode from 'jwt-decode';

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
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.token) {
        const user = jwt_decode(params.token);
        this.authService.storeUserData(params.token, user.data);

        console.log(`User is logged in: ${this.authService.loggedIn()}`);
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
