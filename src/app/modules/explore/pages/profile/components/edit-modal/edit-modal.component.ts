import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Profile } from '../../profile.component';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from 'angularfire2/storage';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  constructor(
    public sb: MatSnackBar,
    public storage: AngularFireStorage,
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profile = data.profile;
    // Using a relative path
    this.profilePicture =
      data.profilePicture === `../../../../../assets/images/default.jpg`
        ? `../../../../../../assets/images/default.jpg`
        : data.profilePicture;
    this.profilePath = data.profilePath;
    this.EditProfileForm = new FormGroup(
      {
        email: new FormControl(this.profile.email, { validators: Validators.email }),
        firstName: new FormControl(this.profile.firstName),
        lastName: new FormControl(this.profile.lastName),
        classification: new FormControl(this.profile.classification)
      },
      {
        updateOn: 'blur',
        validators: [Validators.required]
      }
    );
  }

  profile: Profile;
  EditProfileForm: FormGroup;

  profilePicture: any;
  profilePath: any;

  studentClassification = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];

  ngOnInit() { }

  /**
   * Updates the current state of the profile with respect to the profile image path
   * @param event event object
   */
  async updateCurrentProfilePicture(event) {
    let file: File = event.target.files[0];
    if (file) {
      // If a file was uploaded before exiting the item selection
      let validFileTypes = [`image/jpeg`, `image/jpg`, `image/png`];
      if (validFileTypes.includes(file.type)) {
        // Checks the file type if it is valid
        try {
          if (this.profilePath !== '') {
            // Deletes the previous association and file for the Profile Picture
            await this.deleteCurrentProfile();
          }
          // Saves a path as the point of access to the image in FireBase
          this.profilePath = `profile_pictures/${Date.now()}_${file.name}`;
          this.profile.profileImage = this.profilePath;

          this.uploadCurrentProfilePicture(file, this.profilePath);
        } catch (err) {
          console.error(err);
          this.sb.open(
            'Cannot connect to servers at the moment, please try again later.',
            'Close',
            {
              duration: 2000
            }
          );
        }
      } else {
        this.sb.open('Invalid File Type', 'Close', {
          duration: 2000
        });
      }
    }
  }

  /**
   * Updates the current resume by removing the old and replacing it with the new one
   */
  private uploadCurrentProfilePicture(file: File, name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let ref = this.storage.ref(name);
      let task: AngularFireUploadTask = ref.put(file);
      task
        .then(async () => {
          this.profilePicture = await ref.getDownloadURL().toPromise();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Deletes the users current Profile Picture
   */
  private deleteCurrentProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.storage.ref(this.profilePath).delete();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  closeModal(post: any) {
    for (let attribute in post) {
      if (post.hasOwnProperty(attribute)) {
        this.profile[attribute] = post[attribute];
      }
    }
    this.dialogRef.close(this.profile);
  }
}
