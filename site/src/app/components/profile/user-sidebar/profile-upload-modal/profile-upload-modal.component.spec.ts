import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUploadModalComponent } from './profile-upload-modal.component';

describe('ProfileUploadModalComponent', () => {
  let component: ProfileUploadModalComponent;
  let fixture: ComponentFixture<ProfileUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
