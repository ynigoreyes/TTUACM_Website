import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
/**
 * Controller for the Sign Up page.
 */
export class SignupComponent {

  firstName: String;
  lastName: String;
  email: String;
  password: String;
  confirmPassword: String;
  classification: String[] = [
    'Freshman', 'Sophomore', 'Junior', 'Senior',
    'Graduate', 'Doctorate'
  ];

  constructor() { }

  attemptRegister() {
    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };
    console.log(this.firstName);
  }
}
