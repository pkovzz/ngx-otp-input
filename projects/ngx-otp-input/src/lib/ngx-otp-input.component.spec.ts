import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxOtpInputComponent } from './ngx-otp-input.component';

describe('NgxOtpInputComponent', () => {
  let component: NgxOtpInputComponent;
  let fixture: ComponentFixture<NgxOtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOtpInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxOtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
