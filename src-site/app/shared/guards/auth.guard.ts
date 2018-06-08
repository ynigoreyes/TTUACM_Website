import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UserStateService } from '../services/user-state.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userStateService: UserStateService
  ) {

  }

  // Checks to see if the user is logged in. If not, it will redirect to Login
  canActivate() {
    if (this.userStateService.loggedIn()) {
      return true;
    } else {
      this.snackBar.open(`Unauthorized`, 'Close', { duration: 4000 });
      this.router.navigate(['/login']);
    }
  }
}
