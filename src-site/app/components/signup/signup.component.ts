import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) {}

  // During production, remove initial value
  // This is for debugging purposes only
  private SignUpForm = new FormGroup({
    firstName: new FormControl('Miggy'),
    lastName: new FormControl('Reyes'),
    email: new FormControl('email@gmail.com'),
    password: new FormControl('password'),
    confirmPassword: new FormControl('password'),
    classification: new FormControl('Freshman')
  }, {
    updateOn: 'blur',
    validators: [
      Validators.required,
      this.checkPasswords,
      this.checkPasswordLength,
      // this.checkPasswordContent
    ]
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
        alert('Error Creating User. Please Reload page...');
      } else {
        alert('Successfully Created User');
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Makes sure that the passwords match
   */
  checkPasswords(post: FormGroup) {
    const password: string = post.get('password').value;
    const confirmPassword: string = post.get('confirmPassword').value;

    return password === confirmPassword ? null : {mismatch: true};
  }

  checkPasswordLength(post: FormGroup) {
    return post.get('password').value.length >= 8 ? null : {passLength: true};
  }

  checkPasswordContent(post: FormGroup) {
    const email = post.get('email').value;
    console.log(email);

    // REGEX only works on browser console.... IDK What to do really
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(email.toLowerCase)) {
      return null;
    } else {
      console.log('Failed REGEX');
      return {invalidEmail: true};
    }
  }

  // Used for Debugging
  status(post: FormGroup) {
    console.log(post);
  }
}
