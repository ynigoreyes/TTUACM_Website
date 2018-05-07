import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private appComp: AppComponent,
    private router: Router
  ) { }

  private close() {
    this.appComp.close();
  }

  private open() {
    this.appComp.open();
  }

}
