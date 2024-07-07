import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  NgxOtpInputComponent,
  NGX_OTP_STATUS,
  NgxOtpInputComponentOptions,
} from 'ngx-otp-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    NgxOtpInputComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  otpStatusEnum = NGX_OTP_STATUS;
  showNgxOtpInput = true;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
    hideInputValues: false,
    regexp: /^[0-9]+$/,
    blinkingCursor: true,
    ariaLabels: ['a', 'b', 'c', 'd', 'e', 'f'],
  };
  ariaLabels = '';
  disabled = false;
  otpChangeValue = '…';
  otpCompleteValue = '-';

  ngOnInit(): void {
    this.formatAriaLabelsForDisplay();
  }

  onOtpChange(otp: string[]) {
    this.otpChangeValue = otp.join(', ');
  }

  onOtpComplete(otp: string) {
    this.otpCompleteValue = otp;
  }

  formatAriaLabelsForDisplay() {
    this.ariaLabels = this.otpOptions.ariaLabels!.join(', ');
  }

  formatAriaLabelsForSave() {
    const ariaLabelsInputValue = this.ariaLabels.split(',');
    this.otpOptions.ariaLabels = ariaLabelsInputValue.map((entry) =>
      entry.replace(/\s/g, ''),
    );
  }

  handleComponentReload() {
    this.showNgxOtpInput = false;
    setTimeout(() => {
      this.showNgxOtpInput = true;
    });
  }
}
