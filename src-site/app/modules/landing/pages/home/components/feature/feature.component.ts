import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Feature } from '../../models/Feature.interface';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  @Input() feature: Feature;

  constructor(public router: Router) { }

  ngOnInit() { }

  navigateTo() {
    this.router.navigate([this.feature.reroute])
      .catch(err => {
        console.error('error navigating to events page. There is probably something wrong with the router link passed');
      });
    console.log(`Navigating to ${this.feature.reroute}`);
  }
}
