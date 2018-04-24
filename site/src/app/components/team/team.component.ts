import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent {

  team: object;

  constructor(private http: HttpClient) {
    this.http.get('http://localhost:80/users/get-team').subscribe((results) => {
      this.team = results['data'];
  });
  }

}
