import { TestBed } from '@angular/core/testing';

import { NgxOtpInputService } from './ngx-otp-input.service';

describe('NgxOtpInputService', () => {
  let service: NgxOtpInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxOtpInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
