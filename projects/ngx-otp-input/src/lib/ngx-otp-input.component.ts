import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasteDirective } from './directives/paste.directive';
import { AutoFocusDirective } from './directives/autoFocus.directive';
import {
  InputNavigationsDirective,
  ValueChangeEvent,
} from './directives/inputNavigations.directive';
import { AutoBlurDirective } from './directives/autoBlur.directive';

const DEFAULT_OTP_LENGTH = 6;

export interface NgxOtpInputComponentConfig {
  otpLength: number;
  autoFocus?: boolean;
  autoBlur?: boolean;
  hideInputValues?: boolean;
  regexp?: RegExp;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasteDirective,
    AutoFocusDirective,
    InputNavigationsDirective,
    AutoBlurDirective,
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
    hideInputValues: false,
    regexp: /^[0-9]+$/,
  };

  get inputType(): string {
    return this.config.hideInputValues ? 'password' : 'text';
  }

  ngOnInit(): void {
    this.initOtpInputArray();
  }

  private initOtpInputArray(): void {
    this.ngxOtpInputArray = new FormArray<FormControl<string | null>>(
      Array.from(
        { length: this.config.otpLength },
        () => new FormControl(null, Validators.required),
      ),
    );
  }

  handleInputChanges($event: ValueChangeEvent) {
    const [index, value] = $event;
    this.ngxOtpInputArray.controls[index].setValue(value);
  }
}
