import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Feature } from '../../models/Feature.interface';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {
  @Input() feature: Feature;

  constructor(public router: Router) { }

  navigateTo() {
    this.router.navigate([this.feature.reroute])
      .catch(err => {
        console.error('error navigating to events page. There is probably something wrong with the router link passed');
      });
  }
}
