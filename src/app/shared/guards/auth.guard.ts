import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UserStateService } from '../services/user-state.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userStateService: UserStateService
  ) {}

  /**
   * Checks if the user is logged in
   *
   * @returns {boolean} checkLoggedIn() - references the user state and checks status
   */
  canActivate(): boolean {
    return this.checkLoggedIn();
  }

  canLoad() {
    return this.checkLoggedIn();
  }

  /**
   * Checks to see if the user is currently logged in
   */
  private checkLoggedIn() {
    if (this.userStateService.loggedIn()) {
      return true;
    } else {
      this.snackBar.open(`You must login first`, 'Close', { duration: 4000 });
      this.router.navigate(['/auth']);
    }
  }
}
