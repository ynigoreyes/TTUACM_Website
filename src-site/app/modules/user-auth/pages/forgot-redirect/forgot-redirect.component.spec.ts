import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotRedirectComponent } from './forgot-redirect.component';

describe('ForgotRedirectComponent', () => {
  let component: ForgotRedirectComponent;
  let fixture: ComponentFixture<ForgotRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotRedirectComponent ]
    })
    .compileComponents();
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
