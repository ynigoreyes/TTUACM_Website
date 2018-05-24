import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  constructor(
    private router: Router,
  ) { }

  public ResetForm = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  }, {
      updateOn: 'blur',
      validators: [
        Validators.required,
        this.checkPasswords,
        this.checkPasswordLength
      ]
    });

  /**
   * Accepts a valid password to replace the user's password
   */
  changePassword(post: FormGroup) {
    console.log(post);
  }

  /**
   * Makes sure that the passwords match
   */
  checkPasswords(post: FormGroup) {
    const password: string = post.get('password').value;
    const confirmPassword: string = post.get('confirmPassword').value;

    console.log(post, password, confirmPassword);

    return password === confirmPassword ? null : { mismatch: true };
  }

  checkPasswordLength(post: FormGroup) {
    return post.get('password').value.length >= 8 ? null : { passLength: true };
  }

}
