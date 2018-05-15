import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent {

  constructor(private authService: AuthService) { }

  forgotForm = new FormGroup ({
    email: new FormControl('', {validators: Validators.required})
  });

  private attemptForget(post: FormGroup) {
    const currentEmail =  post['email'].trim();

  }
}
