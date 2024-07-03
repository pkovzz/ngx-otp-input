import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxOtpInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-otp-input-demo';

  onOtpChange(otp: string[]) {
    console.log('OTP changed to: ', otp);
  }

  onOtpComplete(otp: string) {
    console.log('OTP is complete: ', otp);
  }
}
