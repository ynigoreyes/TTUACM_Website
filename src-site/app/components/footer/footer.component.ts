import { Component, Inject } from '@angular/core';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    public dialog: MatDialog,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) { }

  private name:     string = null;
  private email:    string = null;
  private message:  string = null;

  openDialog(): void {
    const dialogRef = this.dialog.open(ContactModalComponent, {
      width: '700px',
      data: {
        name: this.name,
        email: this.email,
        message: this.message
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      // If the user has pressed the Confirm button
      if (result) {
        const message = {
          name: result.name,
          email: result.email,
          message: result.message
        };
        this.contactService.sendEmail(message).subscribe(data => {
          if (data['success']) {
            this.snackBar.open(
              'Success!',
              'Dismiss', { duration: 4000 }
            );
          } else {
            this.snackBar.open(
              'Error sending message. Please try again...',
              'Dismiss', { duration: 4000 }
            );
          }
        });
      }

    });
  }
}
