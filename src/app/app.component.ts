import { Component } from '@angular/core';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showNgxOtpInput = true;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
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
}
