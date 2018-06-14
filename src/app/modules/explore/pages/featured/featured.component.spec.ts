import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedComponent } from './featured.component';
import { MaterialModule } from '../../../../shared/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FeaturedComponent', () => {
  let component: FeaturedComponent;
  let fixture: ComponentFixture<FeaturedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ FeaturedComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
