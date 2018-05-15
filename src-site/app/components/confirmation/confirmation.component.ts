import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(private authService: AuthService) { }

  public userEmail: string;

  ngOnInit() {
    this.authService.currentEmail.subscribe(email => {
      this.userEmail = email;
    });
  }

}
