import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ngx-otp-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'ngx-otp-input.component.html',
  styleUrl: 'ngx-otp-input.component.scss',
})
export class NgxOtpInputComponent {}
