import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMethodsComponent } from './auth-methods.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

describe('AuthMethodsComponent', () => {
  let component: AuthMethodsComponent;
  let fixture: ComponentFixture<AuthMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [AuthMethodsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
