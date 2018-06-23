import { Component, OnInit } from '@angular/core';
import { UserStateService } from '@acm-shared/services/user-state.service';

export interface Profile {
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
  constructor(public state: UserStateService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profile = this.state.getUser()['data'];
    console.log(this.profile);
  }
}
