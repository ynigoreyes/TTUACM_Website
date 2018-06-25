import { Component, OnInit } from '@angular/core';
import { UserStateService } from '@acm-shared/services/user-state.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { ProfileService } from '../../services/profile.service';
import { MatSnackBar } from '@angular/material';

export interface Profile {
  resume: string;
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
  public loading: boolean = true;

  public resumeFile: any;
  public resumePath: string;

  constructor(
    public state: UserStateService,
    public storage: AngularFireStorage,
    public profileService: ProfileService,
    public sb: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadProfile()
      .then(() => {
        this.loading = false;
        console.log(this.resumeFile);
      })
      .catch(err => {
        this.loading = false;
        console.error(err);
      });
  }

  /**
   * Loads the user's profile and their picture from firebase
   */
  loadProfile(): Promise<Error> {
    return new Promise(async (resolve, reject) => {
      this.profile = this.state.getUser();
      try {
        const resumeRef: AngularFireStorageReference = this.storage.ref(this.profile.resume);
        this.resumeFile = await resumeRef.getDownloadURL().toPromise();
        this.resumePath = this.profile.resume;

        const imageRef: AngularFireStorageReference = this.storage.ref(this.profile.profilePicture);
        this.profileImage = await imageRef.getDownloadURL().toPromise();
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
  async updateCurrentResume(event: any) {
    let file: File = event.target.files[0];

    try {
      if (this.resumeFile !== null) {
        console.log('Deleting old resume...');
        await this.deleteCurrentResume();
      }
      this.resumePath = `resumes/${Date.now()}_${file.name}`;
      this.profile.resume = this.resumePath;

      this.uploadCurrentResume(file, this.resumePath)
        .then(() => {
          this.profileService.uploadResume(this.resumePath).subscribe(
            (data) => {
              this.state.updateUser(this.profile);
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
      let ref = this.storage.ref(name);
      let task: AngularFireUploadTask = ref.put(file);
      task
        .then(async () => {
          this.resumeFile = await ref.getDownloadURL().toPromise();
          console.log(this.resumeFile);
          resolve();
        })
        .catch((err) => {
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
        console.log(this.resumePath);
        this.storage.ref(this.resumePath).delete();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
}
