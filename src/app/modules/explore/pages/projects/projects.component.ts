import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ProfileService } from '../../services/profile.service';
import { UserStateService } from '@acm-shared/services/user-state.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  constructor(
    public state: UserStateService,
    public fb: FormBuilder,
    private snackbar: MatSnackBar,
    private profileService: ProfileService
  ) { }

  public topics: Array<string> = [
    'Machine Learning',
    'NodeJS',
    'Algorithms',
    'Other',
  ];
  public ClubForm: FormGroup;

  ngOnInit() {
    this.ClubForm = this.fb.group({
      topic: this.fb.array([]),
      otherTopic: new FormControl('')
    });
  }

  public onChange(topic: string, isChecked: boolean) {
    const topicsFormArray = <FormArray>this.ClubForm.controls.topic;
    if (isChecked) {
      topicsFormArray.push(new FormControl(topic));
    } else {
      let index = topicsFormArray.controls.findIndex(x => x.value === topic);
      topicsFormArray.removeAt(index);
    }
  }

  public onSubmit(post: FormGroup) {
    const data = {
      email: this.state.getUser().email,
      topics: post['topic'],
      otherTopic: post['otherTopic'].trim()
    };

    if (!data.topics.includes('Other')) {
      data.otherTopic = '';
    }

    this.snackbar.open('Registering... This may take a moment', 'Close', { duration: 8000 });

    this.profileService.saveUserToGoogleGroup(data).subscribe(
      status => {
        this.snackbar.open('Thank you for telling us about your interests!', 'Close', { duration: 3000});
      },
      err => {
        this.snackbar.open('Error sending message, please try again later...', 'Close', {
          duration: 2000
        });
      }
    );
  }
}
