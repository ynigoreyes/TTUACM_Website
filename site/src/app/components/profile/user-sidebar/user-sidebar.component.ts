import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfileUploadModalComponent } from './profile-upload-modal/profile-upload-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent {
  private profile: object;
  private image: string = '../../../../assets/images/default.svg';
  private loading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe(
        data => this.profile = data['user'],
        err => console.log('error'),
        () => {
          console.log(this.profile);
          this.loading = false;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

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
