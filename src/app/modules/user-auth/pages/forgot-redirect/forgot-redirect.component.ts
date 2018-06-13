import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-redirect',
  templateUrl: './forgot-redirect.component.html',
  styleUrls: ['./forgot-redirect.component.scss']
})
export class ForgotRedirectComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    this.checkForToken();
  }

  private resetToken: string;

  public ResetForm = new FormGroup(
    {
      password: new FormControl('', Validators.minLength(8)),
      confirmPassword: new FormControl('')
    },
    {
      updateOn: 'blur',
      validators: Validators.required
    }
  );

  checkForToken() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!params.token) {
        this.router.navigate(['/auth']);
        this.snackbar.open('Access Denied', 'Close', { duration: 2000 });
      } else {
        this.resetToken = params.token;
      }
    });
  }

  /**
   * Accepts a valid password to replace the user's password
   *
   * @param {FormGroup} post - A form with the values of the new password
   * @param {string} post.password - The new valid password
   */
  changePassword(post: FormGroup) {
    this.authService.resetPassword(post['password'], this.resetToken).subscribe(
      () => {
        this.router.navigate(['auth/login']);
        this.snackbar.open('You have successfully updated your password', 'Close', {
          duration: 2000
        });
      },
      err => {
        this.snackbar.open('Error updating your password... Please try again later', 'Close', {
          duration: 2000
        });
      }
    );
  }

  /**
   * Accepts a valid password to replace the user's password
   *
   * @param {FormGroup} post - A form with the values of the new password
   * @param {string} post.password - The password attempt
   * @param {string} post.confirmPassword - The confirmation that the user has typed the correct password
   */
  checkPasswords(post: FormGroup) {
    const password: string = post['password'];
    const confirmPassword: string = post['confirmPassword'];
    if (password !== confirmPassword) {
      setTimeout(() => {
        this.ResetForm.controls['confirmPassword'].setErrors({ mismatch: true });
      });
    } else {
      setTimeout(() => {
        this.ResetForm.controls['confirmPassword'].setErrors(null);
      });
    }
  }
}
