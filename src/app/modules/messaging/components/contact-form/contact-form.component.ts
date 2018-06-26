import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ContactService } from '../../services/contact.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactPost } from '../../models/contact-form.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  constructor(
    private snackbar: MatSnackBar,
    private contactService: ContactService
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

  public ContactForm = new FormGroup(
    {
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      topic: new FormControl(this.topics[0]),
      message: new FormControl('', Validators.required)
    },
    { updateOn: 'change' }
  );

  public onSubmit(post: FormGroup) {
    const data: ContactPost = {
      name: post['name'].trim(),
      email: post['email'].trim(),
      topic: post['topic'].trim(),
      message: post['message'].trim()
    };

    this.contactService.sendEmail(<ContactPost>data).subscribe(
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
