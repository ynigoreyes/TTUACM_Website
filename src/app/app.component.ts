import { Component, OnInit } from '@angular/core';
import { environment } from '@acm-environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor( ) { }

  ngOnInit(): void {
    if (!environment.production) {
      console.log('Running in development...');
      console.log(environment);
    }
  }
}
