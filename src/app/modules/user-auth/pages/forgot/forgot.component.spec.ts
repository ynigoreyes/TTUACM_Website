import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotComponent } from './forgot.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserStateService } from '../../../../shared/services/user-state.service';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotComponent', () => {
  let component: ForgotComponent;
  let fixture: ComponentFixture<ForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotComponent],
      imports: [MaterialModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [AuthService, HttpClient, HttpHandler, UserStateService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
