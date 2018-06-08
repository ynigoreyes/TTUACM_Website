import { Component } from '@angular/core';
import * as data from '../../../assets/team.json';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent {

  team: object;

  constructor() {
    this.team = data;
  }

}
