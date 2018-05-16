import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSidebarComponent } from './user-sidebar.component';
import { MatProgressSpinnerModule } from '@angular/material';

describe('UserSidebarComponent', () => {
  let component: UserSidebarComponent;
  let fixture: ComponentFixture<UserSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSidebarComponent ],
      imports: [MatProgressSpinnerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
