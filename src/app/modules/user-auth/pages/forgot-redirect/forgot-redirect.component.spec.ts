import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotRedirectComponent } from './forgot-redirect.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserStateService } from '../../../../shared/services/user-state.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ForgotRedirectComponent', () => {
  let component: ForgotRedirectComponent;
  let fixture: ComponentFixture<ForgotRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotRedirectComponent],
      imports: [MaterialModule, BrowserAnimationsModule, RouterTestingModule],
      providers: [AuthService, HttpClient, HttpHandler, UserStateService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
