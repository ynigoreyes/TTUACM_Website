import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmpassword',
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
