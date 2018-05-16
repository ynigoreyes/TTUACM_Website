import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FooterComponent } from '../footer.component';


// TODO: Make this modal into a page and put it in the side nav OR make it a static button in the corner
@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
/**
 * A Modal that allows user's to send ACM questions.
 * This is connected to the FooterComponent
 */
export class ContactModalComponent {
  ContactUsForm = new FormGroup({
    name: new FormControl('An Interested Student', Validators.required),
    email: new FormControl('', Validators.required),
    message: new FormControl('Love what you guys are doing!', Validators.required)
  });

  constructor(
    public thisDialogRef: MatDialogRef<FooterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Creates a post to the backend/nodemailer
   * @param post A valid post containing the user's name, email and their message
   */
  onCloseConfirm(post: FormGroup) {
    this.data = {
      name: post['name'].trim(),
      email: post['email'].trim(),
      message: post['message'].trim()
    };

    this.thisDialogRef.close(this.data);
  }

  /**
   * Closes the modal and nothing else
   */
  onCloseCancel() {
    this.thisDialogRef.close();
  }

}
