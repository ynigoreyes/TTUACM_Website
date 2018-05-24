import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  forgotForm = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email] })
  });

  public attemptForget(post: FormGroup) {
    const currentEmail = post['email'].trim();
    this.authService.forgotUser(currentEmail)
      .subscribe(status => {
        this.router.navigate(['/redirect']);
      });
  }
}
