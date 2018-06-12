import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ContactService } from '../../services/contact.service';
import { UserStateService } from '../../../../shared/services/user-state.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  constructor(
    private snackbar: MatSnackBar,
    private contactService: ContactService,
    public userStateService: UserStateService
  ) {}

  public user: object = {
    name: null,
    email: null
  };

  public topics: Array<string> = [
    'Interesting Tech',
    'Problem with the website',
    'Looking to get involved',
    'Software Development Meetings',
    'Other',
    'Emergency'
  ];

  public autoFillName = this.user['name'] != null ? this.user['name'] : '';
  public autoFillEmail = this.user['email'] != null ? this.user['email'] : '';

  public ContactForm = new FormGroup(
    {
      name: new FormControl(this.autoFillName),
      email: new FormControl(this.autoFillEmail, [Validators.required, Validators.email]),
      topic: new FormControl(this.topics[0]),
      message: new FormControl('', Validators.required)
    },
    { updateOn: 'change' }
  );

  /**
   * Auto Fill the form with the user's email and name
   * by grabbing the current user from the auth service
   */
  ngOnInit() {
    // Not yet implimented. Will save for another day
    this.userStateService.userObject.subscribe(currentUser => {
      this.user = currentUser;
    });
  }

  public onSubmit(post: FormGroup): void {
    const data: object = {
      name: post['name'].trim(),
      email: post['email'].trim(),
      topic: post['topic'].trim(),
      message: post['message'].trim()
    };

    this.contactService.sendEmail(data).subscribe(
      status => {
        this.snackbar.open('Message successfully sent. Thank You!', 'Close', { duration: 3000 });
      },
      err => {
        this.snackbar.open('Error sending message, please try again later...', 'Close', {
          duration: 2000
        });
      }
    );
  }
}
