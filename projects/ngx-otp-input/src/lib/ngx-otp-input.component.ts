import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasteDirective } from './directives/paste.directive';
import { AutoFocusDirective } from './directives/autoFocus.directive';

const DEFAULT_OTP_LENGTH = 6;

export interface NgxOtpInputComponentConfig {
  otpLength: number;
  autoFocus: boolean;
  autoBlur: boolean;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasteDirective,
    AutoFocusDirective,
  ],
  selector: 'ngx-otp-input',
  templateUrl: 'ngx-otp-input.component.html',
  styleUrl: 'ngx-otp-input.component.scss',
})
export class NgxOtpInputComponent implements OnInit {
  protected ngxOtpInputArray!: FormArray<FormControl<string | null>>;

  @Input() config: NgxOtpInputComponentConfig = {
    otpLength: DEFAULT_OTP_LENGTH,
    autoFocus: true,
    autoBlur: true,
  };

  ngOnInit(): void {
    this.initOtpInputArray();
  }

  private initOtpInputArray(): void {
    this.ngxOtpInputArray = new FormArray<FormControl<string | null>>(
      Array.from(
        { length: this.config.otpLength },
        () => new FormControl(null),
      ),
    );
  }
}
