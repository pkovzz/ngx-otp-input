import { Component } from '@angular/core';
import { NgxOtpInputConfig } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    pattern: /^[a-zA-Z]+$/,
  };
}
