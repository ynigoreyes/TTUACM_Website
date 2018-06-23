import { Component, OnInit } from '@angular/core';
import { Feature } from './models/Feature.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStateService } from '../../../../shared/services/user-state.service';
import * as jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  /**
   * Determines what will be featured on the home page
   */
  public features: Array<Feature> = [
    {
      icon: 'event',
      header: 'Events',
      reroute: `/events/all-events`,
      description:
        'ACM organizes a variety of events where each and every student that attends can walk away with learning something new or by making a new friend that can teach them something along the way',
      logoBackgroundColor: '#5d4037'
    },
    {
      icon: 'people',
      header: 'Our Team',
      reroute: `/team`,
      description:
        'Our officers are practicing developers, designers and engineers. Just like you, we enjoy programming and creating awesome products. We want to help you learn about interesting technologies and enjoy what you are doing',
      logoBackgroundColor: '#d32f2f'
    },
    {
      icon: 'computer',
      header: 'Development',
      reroute: `/explore/projects`,
      description:
        'We support software and hardware projects and provide knowledge from individuals who are passionate about teaching others.',
      logoBackgroundColor: '#1976d2'
    }
  ];
  constructor(
    public activatedRoute: ActivatedRoute,
    public state: UserStateService,
    public router: Router,
    public snackbar: MatSnackBar
  ) {
    this.checkLoggedIn();
  }

  /**
   * Checks if the has logged in using OAuth
   * On Failure: Redirect to login screen
   * On Success: Logs the user in
   */
  checkLoggedIn(): void {
    this.activatedRoute.queryParams.subscribe(
      (params) => {
        if (params.token) {
          try {
            this.state.setToken(params.token);
          } catch (err) {
            this.router.navigate(['/auth']);
            this.snackbar.open('Authentication Error', 'Close', {
              duration: 2000
            });
          }
        }
      });
  }
}
