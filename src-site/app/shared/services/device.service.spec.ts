import { TestBed, inject } from '@angular/core/testing';

import { DeviceService } from './device.service';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';

describe('DeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService, BreakpointObserver, MediaMatcher, Platform]
    });
  });

  it('should be created', inject([DeviceService], (service: DeviceService) => {
    expect(service).toBeTruthy();
  }));
});
