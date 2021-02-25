import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxOtpInputComponent } from './ngx-otp-input.component';
import { PatternDirective } from '../pattern.directive';
import { NgxOtpInputConfig } from './ngx-otp-input.model';

let stepper = 0;

function getConfig(step): NgxOtpInputConfig {
  const additionalConfig: Partial<NgxOtpInputConfig> = {};

  if (step === 1) {
    additionalConfig['ariaLabels'] = 'my custom aria label';
  } else if (step === 2) {
    additionalConfig['ariaLabels'] = ['a', 'b', 'c', 'd', 'e', 'f'];
  }

  return {
    otpLength: 6,
    autofocus: true,
    ...additionalConfig,
  };
}

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
    component.config = getConfig(stepper);
    fixture.detectChanges();
    stepper++;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria labels', () => {
    const label = fixture.nativeElement.querySelector('label');
    const ariaLabel = label.getAttribute('aria-label');
    expect(ariaLabel).toEqual('my custom aria label');
  });

  it('should set aria labels', () => {
    let mismatchFound = false;
    const labels = fixture.nativeElement.querySelectorAll('label');
    labels.forEach((label: HTMLElement, index: number) => {
      const ariaLabel = label.getAttribute('aria-label');
      mismatchFound = ['a', 'b', 'c', 'd', 'e', 'f'][index] !== ariaLabel;
    });

    expect(mismatchFound).toBeFalse();
  });

  it('should set default aria labels', () => {
    const label = fixture.nativeElement.querySelector('label');
    const ariaLabel = label.getAttribute('aria-label');
    expect(ariaLabel).toEqual(component['defaultAriaLabel']);
  });

  it('should create inputs according to config', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toEqual(component.config.otpLength);
  });
});
