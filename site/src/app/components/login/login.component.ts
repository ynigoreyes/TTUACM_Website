import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router, private authService: AuthService) { }

  LoginForm = new FormGroup({
    email: new FormControl('email@gmail.com'),
    password: new FormControl('password')
  }, {
    updateOn: 'blur',
    validators: Validators.required
  });

  attemptLogin(post: FormGroup) {
    const postUser = {
      email: post['email'].trim(),
      password: post['password'].trim()
    };
    this.authService.authenticateUser(postUser).subscribe(data => {
      if (data.user === null) {
        console.log('User Not Found');
      } else {
        console.log('User Found');
        // If the user is found, we want to save their token and data into local storage
        console.log(data.user);
      }
    });
  }
}
