import { Component, OnInit } from '@angular/core';
import { UserStateService } from '@acm-shared/services/user-state.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { ProfileService, UpdateUserPayload } from '../../services/profile.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';

export interface Profile {
  resume: string;
  profileImage: string;
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
  public loading: boolean = true;
  public profile: Profile; // User Profile Object

  public profilePicture: any = `../../../../../assets/images/default.jpg`;
  public profilePath: string; // Path for firebase

  public resumeFile: any; // URL for downloading the resume
  public resumePath: string; // Path for firebase

  constructor(
    public state: UserStateService,
    public storage: AngularFireStorage,
    public profileService: ProfileService,
    public sb: MatSnackBar,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    try {
      await this.loadProfile();
      await this.loadResume();
      console.log(this.resumeFile);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Loads the user's profile and their picture from firebase
   */
  loadProfile(): Promise<Error> {
    return new Promise(async (resolve, reject) => {
      this.profile = this.state.getUser();
      try {
        if (this.profile.profileImage !== '') {
          const imageRef: AngularFireStorageReference = this.storage.ref(
            this.profile.profileImage
          );
        this.profilePicture = await imageRef.getDownloadURL().toPromise();
        this.profilePath = this.profile.profileImage;
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Loads the user's resume from firebase
   *
   * @requires profile Needs a profile to be defined
   */
  loadResume(): Promise<Error> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.profile.resume !== '') {
          const resumeRef: AngularFireStorageReference = this.storage.ref(this.profile.resume);
          this.resumeFile = await resumeRef.getDownloadURL().toPromise();
          this.resumePath = this.profile.resume;
        } else {
          this.resumeFile = null;
        }
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
   *
   * `resumes/1529887889666_pdffake.pdf`
   * `firebase-folder-for-resumes/Current-Date-In-MS_filename`
   */
  async updateCurrentResume(event: any) {
    let file: File = event.target.files[0];

    try {
      if (this.resumeFile) {
        await this.deleteCurrentResume();
      }
      this.resumePath = `resumes/${Date.now()}_${file.name}`;
      this.profile.resume = this.resumePath;

      this.uploadCurrentResume(file, this.resumePath).then(() => {
        this.profileService.uploadResume(this.resumePath).subscribe(
          data => {
            this.state.updateUser(this.profile);
            this.sb.open('Successfully updated resume', 'Close', {
              duration: 2000
            });
          });
      });
    } catch (err) {
      console.error(err);
      this.sb.open('Cannot connect to servers at the moment, please try again later.', 'Close', {
        duration: 2000
      });
    }
  }

  /**
   * Updates the current resume by removing the old and replacing it with the new one
   */
  private uploadCurrentResume(file: File, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(file, name);
      let ref = this.storage.ref(name);
      let task: AngularFireUploadTask = ref.put(file);
      task
        .then(async () => {
          this.resumeFile = await ref.getDownloadURL().toPromise();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Deletes the users current resume
   */
  private deleteCurrentResume(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.storage.ref(this.resumePath).delete();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Edits the current user's information
   * Will open a modal to edit the current user's information
   * After closeEditModal is called, the component will send the
   * new user model back to this component and overwrite the previous user
   */
  public editProfileInfo(): void {
    let dialogRef = this.dialog.open(EditModalComponent, {
      width: '80%',
      data: {
        profile: this.profile,
        profilePath: this.profile.profileImage,
        profilePicture: this.profilePicture
      },
      autoFocus: false
    });

    // Will only read data if the user clicked save
    dialogRef.afterClosed().subscribe(async (data: Profile) => {
      if (data) { // If the user actually clicked the sve button
        this.profile = data;

        // Replace current picture if it was changed
        try {
          const imageRef = this.storage.ref(this.profile.profileImage);
          this.profilePicture = await imageRef.getDownloadURL().toPromise();
        } catch (err) {
          console.error(err); // Usually throws an error when the picture was not changed
        }

        // Updates the users's global object
        try {
          const payload: UpdateUserPayload = await this.profileService
                                                .updateUser(this.profile)
                                                .toPromise();
          if (payload.err) {
            throw payload.err;
          }

          this.profile = payload.user;
          await this.state.setUser();
          this.sb.open('Successfully updated profile', 'Close', {
            duration: 2000
          });

        } catch (err) {
          console.error(err);
          this.sb.open('Error saving new profile information. Please try again later', 'Close', {
            duration: 2000
          });
        }
      }
    });
  }
}
