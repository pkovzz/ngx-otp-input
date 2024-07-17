import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxOtpInputComponent } from './ngx-otp-input.component';
import { NgxOtpInputComponentOptions } from './default.config';
import { NgxOtpStatus } from 'ngx-otp-input';

/**
 * TODO: add many-many more test cases!
 */

describe('NgxOtpInputComponent with default options', () => {
  let component: NgxOtpInputComponent;
  let fixture: ComponentFixture<NgxOtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOtpInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxOtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the default options', () => {
    expect(component.ngxOtpOptionsInUse).toBeDefined();
  });

  it('should have as many inputs as the length of the otp', () => {
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    expect(inputElements.length).toEqual(
      component.ngxOtpOptionsInUse.otpLength,
    );
  });

  it('should have been focused on the first input', () => {
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    expect(document.activeElement).toEqual(inputElements[0]);
  });

  // TODO: Fix the test case
  // it('should have been blurred after the otp is completed', () => {
  //   const inputElements = fixture.nativeElement.querySelectorAll('input');
  //   inputElements.forEach((inputElement: HTMLInputElement) => {
  //     inputElement.value = '1';
  //     inputElement.dispatchEvent(new Event('input'));
  //   });
  //   expect(document.activeElement).not.toEqual(inputElements[0]);
  // });

  it('should have the input type as text', () => {
    expect(component.inputType).toEqual('text');
  });

  it('should have default aria labels', () => {
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement, index: number) => {
      expect(inputElement.getAttribute('aria-label')).toEqual(
        `One Time Password Input Number ${index + 1}`,
      );
    });
  });

  it('should have the css class ngx-otp-input-success if the status is success', () => {
    component.status = NgxOtpStatus.SUCCESS;
    fixture.detectChanges();
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      expect(
        inputElement.classList.contains('ngx-otp-input-success'),
      ).toBeTrue();
    });
  });

  it('should have the css class ngx-otp-input-failed if the status is failed', () => {
    component.status = NgxOtpStatus.FAILED;
    fixture.detectChanges();
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      expect(
        inputElement.classList.contains('ngx-otp-input-failed'),
      ).toBeTrue();
    });
  });

  it('should have the css class ngx-otp-input-disabled if the input is disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const inputElements = fixture.nativeElement.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      expect(
        inputElement.classList.contains('ngx-otp-input-disabled'),
      ).toBeTrue();
    });
  });
});

describe('NgxOtpInputComponent with custom options', () => {
  const options: NgxOtpInputComponentOptions = {
    otpLength: 5,
    autoFocus: false,
    autoBlur: false,
    regexp: /^[0-9]+$/,
    hideInputValues: true,
    showBlinkingCursor: true,
    ariaLabels: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
  };

  let component: NgxOtpInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxOtpInputComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(NgxOtpInputComponent);
    component = fixture.componentInstance;
    component.options = options;
    fixture.detectChanges();
  });

  it('should have custom options', () => {
    expect(component.ngxOtpOptionsInUse).toEqual(options);
  });

  it('should have as many inputs as the length of the otp', () => {
    const inputElements = document.querySelectorAll('input');
    expect(inputElements.length).toEqual(
      component.ngxOtpOptionsInUse.otpLength!,
    );
  });

  it('should not have been focused on the first input', () => {
    const inputElements = document.querySelectorAll('input');
    expect(document.activeElement).not.toEqual(inputElements[0]);
  });

  it('should have input type as password', () => {
    const inputElements = document.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement) => {
      expect(inputElement.type).toEqual('password');
    });
  });

  it('should have custom aria labels', () => {
    const inputElements = document.querySelectorAll('input');
    inputElements.forEach((inputElement: HTMLInputElement, index: number) => {
      if (options.ariaLabels) {
        expect(inputElement.getAttribute('aria-label')).toEqual(
          options.ariaLabels[index],
        );
      }
    });
  });

  // TODO: Fix the test case
  // it('should have the css class ngx-blinking-cursor if the showBlinkingCursor option is true', () => {
  //   const inputElements = document.querySelectorAll('input');
  //   inputElements.forEach((inputElement: HTMLInputElement) => {
  //     expect(
  //       inputElement.classList.contains('ngx-blinking-cursor'),
  //     ).toBeTrue();
  //   });
  // });
});
