import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  private resetToken: string;

  public ResetForm = new FormGroup({
    password: new FormControl('', Validators.minLength(8)),
    confirmPassword: new FormControl('')
  }, {
      updateOn: 'blur',
      validators: Validators.required
    });

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => {
        this.resetToken = params.token;
      });
  }

  /**
   * Accepts a valid password to replace the user's password
   */
  changePassword(post: FormGroup) {
    this.authService.resetPassword(post['password'], this.resetToken)
      .subscribe((status) => {
        if (status['success'] === true) {
          this.router.navigate(['/login']);
          this.snackbar.open('You have successfully updated your password',
            'Close', {duration: 2000});
        } else {
          this.snackbar.open('Error updating your password... Please try again later',
            'Close', { duration: 2000 });
        }
      });
  }

  /**
   * Makes sure that the passwords match
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
