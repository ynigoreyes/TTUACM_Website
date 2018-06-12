import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStateService } from '../../../../shared/services/user-state.service';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {
  constructor(public userStateService: UserStateService) {}

  public userEmail: string;

  ngOnInit() {
    this.userStateService.userEmail.subscribe(email => {
      this.userEmail = email;
    });
  }
}
