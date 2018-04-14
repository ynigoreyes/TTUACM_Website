import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {

  team: any;

  constructor(private http: Http) {
    this.http.get('http://localhost:80/users/get-team').subscribe((results) => {
    this.team = results.json().data;
  });
  }

}
