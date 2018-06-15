import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../../../shared/services/user-state.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {
  constructor(
    public state: UserStateService,
    public auth: AuthService,
    public snackbar: MatSnackBar
  ) {}

  public userEmail: string;
  public userToken: string;

  ngOnInit() {
    this.state.userEmail.subscribe(email => {
      this.userEmail = email;
    });
    this.state.HEXToken.subscribe(token => {
      this.userToken = token;
    });
  }

  /**
   * Resends the email using the email attempt
   *
   * @returns {null} None
   */
  resendEmail(): void {
    this.auth.resendConfirmationEmail(this.userEmail, this.userToken).subscribe(
      () => {
        this.snackbar.open('Email Delivered', 'Close', {
          duration: 2000
        });
      },
      err => {
        this.snackbar.open('Error Sending Email', 'Close', {
          duration: 2000
        });
      }
    );
  }
}
