import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) { }

  public forgotForm = new FormGroup({
    email: new FormControl('', { validators: [
      Validators.required, Validators.email] })
  });

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => {
        if (params['tokenError'] === 'true') {
          setTimeout(() => {
            this.snackbar.open('Error verifying user request',
            'Close', {duration: 3000});
          }, 200);
        }
      });
  }


  public attemptForget(post: FormGroup) {
    const currentEmail = post['email'].trim();
    this.authService.forgotUser(currentEmail)
      .subscribe(status => {
        this.router.navigate(['/redirect']);
      });
  }
}
