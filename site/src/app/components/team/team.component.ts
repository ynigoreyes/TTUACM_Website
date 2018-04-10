import { Component, OnInit } from '@angular/core';
import * as Team from '../../../assets/team.json';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  team = Team;
  constructor() {
  }

  ngOnInit() {
  }

}
