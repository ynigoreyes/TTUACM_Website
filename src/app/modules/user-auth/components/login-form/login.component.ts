import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { UserPost, User } from '../../models/UserPost';
import { UserStateService } from '../../../../shared/services/user-state.service';
export interface LoginResponse {
  user?: {
    firstName: string;
    lastName: string;
  };
  msg?: string;
  token?: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    public userStateService: UserStateService
  ) {}

  LoginForm = new UserPost({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      validators: [Validators.required]
    })
  });

  /**
   * Logs in the user's email and password and sends to backend to check if
   * password matches
   *
   * OnError: Tells the user that is an invalid credentials
   * OnSuccess: Redirects the user to the Events page and sets a token in local storage
   *
   * @param {UserPost} post - User Login Form Values/Object
   */
  public attemptLogin(post: UserPost): void {
    const postUser: User = {
      email: post.email.trim(),
      password: post.password.trim()
    };
    this.authService.authenticateUser(postUser).subscribe(
      (data: LoginResponse) => {
        this.snackBar.open(`Welcome ${data.user.firstName}!`, 'Close', { duration: 2000 });

        // Stores the user's information into the local storage
        this.userStateService.setToken(data.token);
        this.userStateService.setUser(data.user);

        this.router.navigate(['/events/all-events']);
      },
      (err) => {
        console.log(err);
        this.snackBar.open(err['error'].msg, 'Close', {
          duration: 2000
        });
      }
    );
  }
}
