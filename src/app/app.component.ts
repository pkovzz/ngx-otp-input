import { Component, ViewChild } from '@angular/core';
import { NgxOtpInputComponent, NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'ngx-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('ngxotp') ngxOtp: NgxOtpInputComponent;

  showNgxOtpInput = true;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
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
  fillResult = '';

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
}
