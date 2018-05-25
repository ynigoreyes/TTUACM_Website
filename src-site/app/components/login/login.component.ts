import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  LoginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required]
    }),
    password: new FormControl('', {
      validators: [Validators.required]
    })
  });

  public attemptLogin(post: FormGroup) {
    const postUser = {
      email: post['email'].trim(),
      password: post['password'].trim()
    };
    this.authService.authenticateUser(postUser).subscribe(data => {
      if (data['user'] === null) {
        // TODO: Do something to protect the user from just trying all
        // different types of passwords
        this.snackBar.open(data['msg'], 'Close', { duration: 3000 });
      } else {
        // If the user is found, we want to save their token and data into local storage
        this.snackBar.open(`Welcome ${data['user'].firstName}!`, 'Close', { duration: 2000 });

        // Stores the user's information into the local storage
        this.authService.storeUserData(data['token'], data['user']);

        this.router.navigate(['/dashboard']);
      }
    });
  }
}
