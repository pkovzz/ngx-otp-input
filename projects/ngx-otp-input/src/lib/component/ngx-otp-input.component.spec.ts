import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxOtpInputComponent } from './ngx-otp-input.component';
import { PatternDirective } from '../pattern.directive';

describe('NgxOtpInputComponent', () => {
  let component: NgxOtpInputComponent;
  let fixture: ComponentFixture<NgxOtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxOtpInputComponent, PatternDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxOtpInputComponent);
    component = fixture.componentInstance;
    component.config = {
      otpLength: 6,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create inputs according to config', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toEqual(component.config.otpLength);
  });
});
