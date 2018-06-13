import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-authmethods',
  templateUrl: './auth-methods.component.html',
  styleUrls: ['./auth-methods.component.scss']
})
export class AuthMethodsComponent implements OnInit {

  constructor() { }
  public location: string = environment.host;
  ngOnInit() {
  }

}
