import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  // There's definitely a better way to do this...

  constructor() {
    this.image1 = '../../../assets/images/team.jpg';
    this.image2 = '../../../assets/images/Android_Development_Workshop.jpg';
    this.image3 = '../../../assets/images/Pi_Workshop.jpg';
    this.image4 = '../../../assets/images/Local_Hack_Day.jpg';
    this.image5 = '../../../assets/images/Apples_to_Oranges.jpg';
    this.loading = false;
  }
  public image1: string;
  public image2: string;
  public image3: string;
  public image4: string;
  public image5: string;
  public loading: boolean = true;

}
