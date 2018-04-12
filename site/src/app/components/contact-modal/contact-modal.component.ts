import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
/**
 * A Modal that allows user's to send ACM questions.
 * This is connected to the FooterComponent
 */
export class ContactModalComponent {
  question = {
    name: null,
    email: null,
    message: null
  };

  constructor(public thisDialogRef: MatDialogRef<FooterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCloseConfirm() {
    this.data.name = this.question.name;
    this.data.email = this.question.email;
    this.data.message = this.question.message;

    this.thisDialogRef.close(this.data);
  }

  onCloseCancel() {
    this.thisDialogRef.close('Close');
  }

}
