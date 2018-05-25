import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { Oauth2Service } from '../../services/oauth2.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
/**
 * Controller for the Sign Up page.
 */
export class SignupComponent {

  studentClassification = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];
  constructor(
    private router: Router,
    private authService: AuthService,
    private oauth2Service: Oauth2Service,
    private snackBar: MatSnackBar
  ) { }

  // During production, remove initial value
  // This is for debugging purposes only
  public SignUpForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(8)),
    confirmPassword: new FormControl(''),
    classification: new FormControl('')
  }, {
      updateOn: 'blur',
      validators: Validators.required
    });

  /**
   * If this form is valid, send this form to the backend for storing in the database
   * We also do a little bit of clean up
   *
   * We will strip the user's creds of trailing and leading whitespaces
   * @param post The current state of the form
   */
  attemptRegister(post: FormGroup) {

    const postUser = {
      firstName: post['firstName'].trim(),
      lastName: post['lastName'].trim(),
      email: post['email'].trim(),
      classification: post['classification'],
      password: post['password']
    };

    this.authService.registerUser(postUser).subscribe(data => {
      if (data === false) {
        this.snackBar.open(
          `Error Creating User. Please Reload page...`,
          `Close`, { duration: 3000 });
      } else if (data[`emailAvailable`] === false) {
        this.snackBar.open(
          `Email has already been taken`,
          `Close`, { duration: 2000 });
      } else {
        this.snackBar.open(
          `Please check your email for confirmation`,
          `Close`, { duration: 2000 });
        this.authService.setEmail(postUser.email);
        this.router.navigate(['/confirmation']);
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
        this.SignUpForm.controls['confirmPassword'].setErrors({mismatch: true});
      });
    } else {
      setTimeout(() => {
        this.SignUpForm.controls['confirmPassword'].setErrors(null);
      });
    }
  }
}
