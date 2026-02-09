import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent } from './ngx-otp-input.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgxOtpInputComponent],
  template: `
    <form [formGroup]="form">
      <ngx-otp-input
        formControlName="otp"
        [length]="length"
        [autoFocus]="false"
        [autoBlur]="autoBlur"
        [status]="status"
        [mask]="mask"
        [ariaLabel]="ariaLabel"
        (otpComplete)="completeValue = $event"
        (otpInvalid)="invalidReason = $event.reason"
      ></ngx-otp-input>
    </form>
  `,
})
class TestHostComponent {
  length = 6;
  autoBlur = false;
  status: 'idle' | 'success' | 'error' = 'idle';
  mask = false;
  ariaLabel = 'Test OTP';
  completeValue: string | null = null;
  invalidReason: string | null = null;

  form = new FormGroup({
    otp: new FormControl<string>('', { nonNullable: true }),
  });
}

describe('NgxOtpInputComponent v2', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('NgxOtpInputComponent › should create when used in a reactive form', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('NgxOtpInputComponent › should set aria-label on the group container', () => {
    const root = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-root"]',
    );
    expect(root.getAttribute('aria-label')).toEqual('Test OTP');
  });

  it('NgxOtpInputComponent › should render visual boxes based on length', () => {
    const boxes = fixture.nativeElement.querySelectorAll(
      '[data-testid="ngx-otp-input-box"]',
    );
    expect(boxes.length).toEqual(6);
  });

  it('NgxOtpInputComponent › should write to form control when typing', () => {
    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    nativeInput.value = '123';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.form.controls.otp.value).toEqual('123');
  });

  it('NgxOtpInputComponent › should emit complete when reaching full length', () => {
    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    nativeInput.value = '123456';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.completeValue).toEqual('123456');
  });

  it('NgxOtpInputComponent › should move active box with arrow keys', () => {
    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    nativeInput.value = '1234';
    nativeInput.setSelectionRange(4, 4);
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    let boxes: NodeListOf<HTMLDivElement> =
      fixture.nativeElement.querySelectorAll(
        '[data-testid="ngx-otp-input-box"]',
      );
    expect(boxes[4].classList.contains('ngx-otp-input-active')).toBeTrue();

    nativeInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
    );
    fixture.detectChanges();

    boxes = fixture.nativeElement.querySelectorAll(
      '[data-testid="ngx-otp-input-box"]',
    );
    expect(boxes[3].classList.contains('ngx-otp-input-active')).toBeTrue();

    nativeInput.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight' }),
    );
    fixture.detectChanges();

    boxes = fixture.nativeElement.querySelectorAll(
      '[data-testid="ngx-otp-input-box"]',
    );
    expect(boxes[4].classList.contains('ngx-otp-input-active')).toBeTrue();
  });

  it('NgxOtpInputComponent › should reject non-matching characters and emit invalid', () => {
    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    nativeInput.value = '12a';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.invalidReason).toEqual('char-rejected');
    expect(fixture.componentInstance.form.controls.otp.value).toEqual('12');
  });

  it('NgxOtpInputComponent › should trim pasted values beyond length and emit invalid', () => {
    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );

    const clipboardData = {
      getData: () => '1234567890',
    } as unknown as DataTransfer;

    const pasteEvent = new ClipboardEvent('paste', { clipboardData });
    nativeInput.dispatchEvent(pasteEvent);
    fixture.detectChanges();

    expect(fixture.componentInstance.invalidReason).toEqual('too-long');
    expect(fixture.componentInstance.form.controls.otp.value).toEqual('123456');
  });

  it('NgxOtpInputComponent › should set aria-invalid when status is error', () => {
    fixture.componentInstance.status = 'error';
    fixture.detectChanges();

    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    expect(nativeInput.getAttribute('aria-invalid')).toEqual('true');
  });

  it('NgxOtpInputComponent › should render masked dots when mask is true', () => {
    fixture.componentInstance.mask = true;
    fixture.detectChanges();

    const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="ngx-otp-input-native"]',
    );
    nativeInput.value = '12';
    nativeInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const boxes: HTMLElement[] = Array.from(
      fixture.nativeElement.querySelectorAll(
        '[data-testid="ngx-otp-input-box"]',
      ),
    );

    expect(boxes[0].textContent?.trim()).toEqual('•');
    expect(boxes[1].textContent?.trim()).toEqual('•');
  });
});
