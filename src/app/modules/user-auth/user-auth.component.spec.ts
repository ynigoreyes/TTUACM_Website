import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthComponent } from './user-auth.component';
import { MaterialModule } from '../../shared/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserAuthComponent', () => {
  let component: UserAuthComponent;
  let fixture: ComponentFixture<UserAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ UserAuthComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
