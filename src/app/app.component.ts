import { inject } from '@vercel/analytics';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  NgxOtpInputComponent,
  NgxOtpStatus,
  NgxOtpInputComponentOptions,
} from 'ngx-otp-input';
import { BasicInformationComponent } from '../components/BasicInformation.component';
import { HeaderComponent } from '../components/Header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NgxOtpInputComponent,
    HeaderComponent,
    BasicInformationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('ngxOtpInput') ngxOtpInput!: NgxOtpInputComponent;
  otpStatusEnum = NgxOtpStatus;
  showNgxOtpInput = true;
  otpOptions: NgxOtpInputComponentOptions = {
    otpLength: 5,
    autoFocus: true,
    autoBlur: true,
    hideInputValues: false,
    showBlinkingCursor: true,
    regexp: /^[0-9]+$/,
    ariaLabels: ['a', 'b', 'c', 'd', 'e', 'f'],
    inputMode: 'numeric',
  };
  regexp = '^[0-9]+$';
  ariaLabels = '';
  disabled = false;
  otpChangeValue = '-';
  otpCompleteValue = '-';

  ngOnInit(): void {
    inject();
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
