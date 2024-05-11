import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxOtpInput } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxOtpInput],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ngx-otp-input-demo';
}
