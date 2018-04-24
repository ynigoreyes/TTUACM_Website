import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar.component';

@Component({
  selector: 'app-profile-upload-modal',
  templateUrl: './profile-upload-modal.component.html',
  styleUrls: ['./profile-upload-modal.component.css']
})
export class ProfileUploadModalComponent {
  private defaultImage = '../../../../../assets/images/default.svg';
  private selectedFile: File = null;

  constructor(
    public thisDialogRef: MatDialogRef<UserSidebarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  onFileSelected(event): void {
    this.selectedFile =  <File>event.target.files[0];
  }

  private onCloseConfirm(): void {
    this.thisDialogRef.close(this.selectedFile);
  }

  private onCloseCancel(): void {
    this.thisDialogRef.close();
  }

}
