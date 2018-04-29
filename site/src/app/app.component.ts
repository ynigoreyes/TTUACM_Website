import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {

    window.onscroll = function () { myFunction(); };

    const navbar = document.getElementById('navbar');
    const sticky = navbar.offsetTop;

    function myFunction() {
      if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    }
  }
}
