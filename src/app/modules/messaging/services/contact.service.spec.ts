import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ContactService
      ]
    });
  });

  it('should be created', inject([ContactService], (service: ContactService) => {
    expect(service).toBeTruthy();
  }));
});
