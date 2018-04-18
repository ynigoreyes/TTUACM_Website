import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SignupComponent } from './signup.component';

describe('Checking Password Length', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should validate the password length', () => {
    expect(component.checkPasswordLength(component.SignUpForm['password']).passLength).toBeTruthy();
  });
});
