import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  NgxOtpInputComponent,
  NgxOtpStatus,
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
  @ViewChild('ngxOtpInput') ngxOtpInput!: NgxOtpInputComponent;
  otpStatusEnum = NgxOtpStatus;
  showNgxOtpInput = true;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 6,
    autoFocus: true,
    autoBlur: true,
    hideInputValues: false,
    showBlinkingCursor: true,
    regexp: /^[0-9]+$/,
    ariaLabels: ['a', 'b', 'c', 'd', 'e', 'f'],
  };
  regexp = '^[0-9]+$';
  ariaLabels = '';
  disabled = false;
  otpChangeValue = '-';
  otpCompleteValue = '-';

  ngOnInit(): void {
    this.formatAriaLabelsForDisplay();
  }

  onOtpChange(otp: string[]) {
    const hasValue = otp.some((value) => value !== '');
    if (hasValue) {
      this.otpChangeValue = otp.join(', ');
    } else {
      this.otpChangeValue = '-';
      this.otpCompleteValue = '-';
    }
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

  convertStringToRegexp() {
    this.otpOptions.regexp = new RegExp(this.regexp);
  }

  handleComponentReload() {
    this.showNgxOtpInput = false;
    setTimeout(() => {
      this.showNgxOtpInput = true;
    });
  }

  handleReset() {
    this.ngxOtpInput.reset();
    this.otpChangeValue = '-';
    this.otpCompleteValue = '-';
  }
}
