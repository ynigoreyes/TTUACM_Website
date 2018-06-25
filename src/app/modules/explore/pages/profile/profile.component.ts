import { Component, OnInit } from '@angular/core';
import { UserStateService } from '@acm-shared/services/user-state.service';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { ProfileService } from '../../services/profile.service';
import { MatSnackBar } from '@angular/material';

export interface Profile {
  profilePicture: string;
  classification: string;
  email: string;
  firstName: string;
  hasPaidDues: boolean;
  lastName: string;
  verified: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profile: Profile;
  public profileImage: any = `../../../../../assets/images/default.jpg`;
  public resumeFile: any;
  public loading: boolean = true;

  constructor(
    public state: UserStateService,
    public storage: AngularFireStorage,
    public profileService: ProfileService,
    public sb: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProfile()
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log(err);
      });
  }

  /**
   * Loads the user's profile and their picture from firebase
   */
  loadProfile(): Promise<Error> {
    return new Promise(async (resolve, reject) => {
      this.profile = this.state.getUser();
      try {
        const imageRef: AngularFireStorageReference = this.storage.ref(
          `profile_pictures/test.jpeg`
        );
        const resumeRef: AngularFireStorageReference = this.storage.ref(`resumes/resume.pdf`);
        this.profileImage = await imageRef.getDownloadURL().toPromise();
        resolve();
        this.resumeFile = await resumeRef.getDownloadURL().toPromise();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Saves the actual file into the firebase and the reference into Mongo
   *
   * @param event the upload event of a file
   * @example FileName
   * `resumes/1529887889666_pdffake.pdf`
   * `firebase-folder-for-resumes/Current-Date-In-MS_filename`
   */
  updateCurrentResume(event: any) {
    let file: File = event.target.files[0];
    console.log(file);
    let path = `resumes/${Date.now()}_${file.name}`;
    console.log(path);

    this.profileService.uploadResume(path).subscribe(
      (data) => {
        this.sb.open('Successfully updated resume', 'Close', {
          duration: 2000
        });
      },
      (err) => {
        console.error(err);
        this.sb.open('Error saving resume, please try again later.', 'Close', {
          duration: 2000
        });
      });
  }
}
