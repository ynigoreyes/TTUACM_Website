import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public isSmallDevice: boolean;
  constructor(public route: ActivatedRoute, public snackbar: MatSnackBar) {
    this.isSmallDevice = window.innerWidth < 768;
    this.checkValidatedUser();
  }

  @HostListener('window:resize', ['$event'])
  checkScreen(event): void {
    this.isSmallDevice = event.target.innerWidth < 768;
  }

  checkValidatedUser(): void {
    this.route.queryParams.subscribe(params => {
      if (params.err) {
        this.snackbar.open(params.err, 'Close', {
          duration: 2000
        });
      } else if (params.verify) {
        this.snackbar.open('Successfully validated email', 'Close', {
          duration: 2000
        });
      }
    });
  }
}
