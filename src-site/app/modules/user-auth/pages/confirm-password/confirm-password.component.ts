import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {
  constructor(private authService: AuthService) {}

  public userEmail: string;

  ngOnInit() {
    this.authService.currentEmail.subscribe(email => {
      this.userEmail = email;
    });
  }
}
