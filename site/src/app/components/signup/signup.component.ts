import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  classification: String[] = [
    'Freshman', 'Sophomore', 'Junior', 'Senior',
    'Graduate', 'Doctorate'
  ];

  user = {
    'firstName': String,
    'lastName': String,
    'email': String,
    'password': String,
    'classification': 'Freshman'
  };
  confirmPassword: String;

  constructor() { }

  ngOnInit() {
  }

}
