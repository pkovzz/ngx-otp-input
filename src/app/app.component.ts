import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  NgxOtpBehavior,
  NgxOtpInputComponent,
  NgxOtpInputConfig,
} from 'ngx-otp-input';

@Component({
  selector: 'ngx-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showNgxOtpInput = true;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 4,
    autofocus: true,
    autoblur: true,
    isPasswordInput: false,
    behavior: NgxOtpBehavior.DEFAULT,
    ariaLabels: ['a', 'b', 'v', 'c'],
    classList: {
      container: 'my-super-container',
      inputBox: 'my-super-box-class',
      input: ['my-super-input-class', 'my-super-input-class-array-test'],
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  regex: string;
  ariaLabels: string;
  ngxOtpDisable = false;
  status = null;

  otpChangeResult = [];
  fillResult = null;

  @ViewChild('ngxotp') ngxOtp: NgxOtpInputComponent;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  reload(): void {
    this.showNgxOtpInput = false;
    setTimeout(() => {
      this.showNgxOtpInput = true;
    });
  }

  setRegex(): void {
    // TODO: proper string-to-regexp transform
    this.otpInputConfig.pattern = new RegExp(this.regex);
  }

  setAriaLabels(): void {
    const arr = this.ariaLabels.split(',');
    if (arr.length === 1) {
      this.otpInputConfig.ariaLabels = arr[0];
    } else {
      this.otpInputConfig.ariaLabels = arr.map((entry) =>
        entry.replace(/\s/g, '')
      );
    }
  }

  clear(): void {
    this.ngxOtp.clear();
  }

  handleOtpChange($event: string[]): void {
    this.otpChangeResult = $event;
    this.cdr.detectChanges();
  }

  handleFill($event: string): void {
    this.fillResult = $event;
  }

  changeBehavior(asLegacy: boolean): void {
    this.otpInputConfig.behavior = asLegacy
      ? NgxOtpBehavior.LEGACY
      : NgxOtpBehavior.DEFAULT;
  }
}
