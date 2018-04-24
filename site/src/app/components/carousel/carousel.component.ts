import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
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
  private image1: string;
  private image2: string;
  private image3: string;
  private image4: string;
  private image5: string;
  private loading: boolean = true;

}
