import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormField,
  FormValueControl,
  disabled,
  form,
  minLength,
  readonly,
  required,
} from '@angular/forms/signals';
import { NgxOtpInputComponent } from './ngx-otp-input.component';

// Compile-time assertion that the component satisfies the signal forms custom
// control contract. The library itself deliberately does not import from
// '@angular/forms/signals' so that it keeps working on older Angular versions.
const conformsToFormValueControl: (
  control: NgxOtpInputComponent,
) => FormValueControl<string> = (control) => control;

@Component({
  standalone: true,
  imports: [FormField, NgxOtpInputComponent],
  template: `
    <ngx-otp-input
      [formField]="loginForm.otp"
      [autoFocus]="false"
      [length]="6"
    ></ngx-otp-input>
  `,
})
class SignalFormHostComponent {
  readonly model = signal({ otp: '' });

  readonly loginForm = form(this.model, (path) => {
    required(path.otp);
    minLength(path.otp, 6);
  });
}

describe('NgxOtpInputComponent signal forms integration', () => {
  let fixture: ComponentFixture<SignalFormHostComponent>;
  let nativeInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalFormHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignalFormHostComponent);
    fixture.detectChanges();
    nativeInput = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
  });

  it('should expose the FormValueControl contract', () => {
    expect(conformsToFormValueControl).toBeDefined();
  });

  it('should write typed characters back into the field', () => {
    nativeInput.value = '1234';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().otp).toEqual('1234');
    expect(fixture.componentInstance.loginForm.otp().value()).toEqual('1234');
  });

  it('should render a value pushed onto the field', () => {
    fixture.componentInstance.loginForm.otp().value.set('987654');
    fixture.detectChanges();

    expect(nativeInput.value).toEqual('987654');

    const boxes: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="ngx-otp-input-box"]',
      ),
    );
    expect(boxes.map((box) => box.textContent?.trim()).join('')).toEqual(
      '987654',
    );
  });

  it('should sanitize a value pushed onto the field and push the result back', () => {
    fixture.componentInstance.loginForm.otp().value.set('12ab34567');
    fixture.detectChanges();

    expect(fixture.componentInstance.model().otp).toEqual('123456');
    expect(nativeInput.value).toEqual('123456');
  });

  it('should mark the field as touched on blur', () => {
    expect(fixture.componentInstance.loginForm.otp().touched()).toBeFalse();

    nativeInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.loginForm.otp().touched()).toBeTrue();
  });

  it('should render the error status once an invalid field is touched', () => {
    const otpInput = fixture.debugElement.children[0].componentInstance;
    expect(otpInput.resolvedStatus()).toEqual('idle');

    nativeInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.componentInstance.loginForm.otp().invalid()).toBeTrue();
    expect(otpInput.resolvedStatus()).toEqual('error');
    expect(nativeInput.getAttribute('aria-invalid')).toEqual('true');
  });
});

@Component({
  standalone: true,
  imports: [FormField, NgxOtpInputComponent],
  template: `
    <ngx-otp-input
      [formField]="lockedForm.otp"
      [autoFocus]="false"
    ></ngx-otp-input>
  `,
})
class LockedSignalFormHostComponent {
  readonly model = signal({ otp: '12' });

  readonly lockedForm = form(this.model, (path) => {
    disabled(path.otp, () => true);
  });
}

describe('NgxOtpInputComponent signal forms disabled state', () => {
  it('should disable the native input when the field is disabled', () => {
    TestBed.configureTestingModule({
      imports: [LockedSignalFormHostComponent],
    });

    const fixture = TestBed.createComponent(LockedSignalFormHostComponent);
    fixture.detectChanges();

    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    expect(nativeInput.disabled).toBeTrue();
  });
});

@Component({
  standalone: true,
  imports: [FormField, NgxOtpInputComponent],
  template: `
    <ngx-otp-input
      [formField]="readonlyForm.otp"
      [autoFocus]="false"
    ></ngx-otp-input>
  `,
})
class ReadonlySignalFormHostComponent {
  readonly model = signal({ otp: '12' });

  readonly readonlyForm = form(this.model, (path) => {
    readonly(path.otp, () => true);
  });
}

describe('NgxOtpInputComponent signal forms readonly state', () => {
  it('should ignore typing while the field is readonly', () => {
    TestBed.configureTestingModule({
      imports: [ReadonlySignalFormHostComponent],
    });

    const fixture = TestBed.createComponent(ReadonlySignalFormHostComponent);
    fixture.detectChanges();

    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    expect(nativeInput.readOnly).toBeTrue();

    nativeInput.value = '123456';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().otp).toEqual('12');
    expect(nativeInput.value).toEqual('12');
  });
});
