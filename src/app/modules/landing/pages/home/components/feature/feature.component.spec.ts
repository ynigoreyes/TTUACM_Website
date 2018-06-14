import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureComponent } from './feature.component';
import { MaterialModule } from '../../../../../../shared/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ FeatureComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
