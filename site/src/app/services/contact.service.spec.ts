import { TestBed, inject } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { HttpClientModule } from '@angular/common/http';

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ContactService]
    });
  });

  it('should be created', inject([ContactService], (service: ContactService) => {
    expect(service).toBeTruthy();
  }));
});
