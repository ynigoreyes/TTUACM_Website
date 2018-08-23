import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ProfileService } from '../../services/profile.service';
import { UserStateService } from '@acm-shared/services/user-state.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  constructor(
    public state: UserStateService,
    private snackbar: MatSnackBar,
    private profileService: ProfileService
  ) { }

  public topics: Array<string> = [
    'Python',
    'Machine Learning',
    'App Development',
    'Algorithms/Problem Solving',
    'Other',
  ];

  public ClubForm = new FormGroup(
    {
      topic: new FormControl(this.topics[0]),
      otherTopic: new FormControl('')
    },
    { updateOn: 'change' }
  );

  public onSubmit(post: FormGroup) {
    console.log(this.state.getUser());
    const data = {
      user: this.state.getUser(),
      topic: post['topic'].trim(),
      otherTopic: post['otherTopic'].trim()
    };

    this.profileService.saveUserToGoogleGroup(data).subscribe(
      status => {
        this.snackbar.open('Thank you for telling us about your interests!', 'Close', { duration: 3000});
      },
      err => {
        this.snackbar.open('Error sending message, please try again later...', 'Close', {
          duration: 2000
        });
      }
    )
  }
}
