import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUploadModalComponent } from './profile-upload-modal/profile-upload-modal.component';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {

  constructor(
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.getProfile().subscribe(data => {
      this.profile = data['user'];
      // If the user has a Profile Pic, set that profile picture instead of the
      // default one
      if (this.profile['profilePic'] !== '') {
        console.log('Pic ', this.profile['profilePic']);
        // TODO: Get this link to serve the Image!! Getting the 403 code
        // When I upload an image manually, I get an image, If i do it throught
        // the putObject method, it breaks
      }
      this.image = `https://s3.amazonaws.com/ttuacmweb-test/1524602871022-hackerRank.jpg`;
      this.loading = false;
    });
  }

  private profile: object;
  private image: string = '../../../../assets/images/default.svg';
  private loading: boolean = true;

  openUpdateModal(): void {
    const dialogRef = this.dialog.open(ProfileUploadModalComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.authService.updateProfilePic(result).subscribe(data => {
        console.log(`We got data back: ${data}`);
        // TODO: We need to set the src to target the picture within s3 Bucket
      });
    });
  }

}
