import { Component, OnInit } from '@angular/core';
import * as data from '../../../../../assets/team.json';

export interface Member {
  firstName: string;
  lastName: string;
  position: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  public team: any;
  public data: Member;

  constructor() {
    this.team = data;
  }

  ngOnInit() {}
}
