import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  OtpValueChangeEvent,
} from './directives/inputNavigations.directive';
import { AutoBlurDirective } from './directives/autoBlur.directive';
import { AriaLabelsDirective } from './directives/ariaLabels.directive';
import { NgxOtpInputComponentOptions, defaultOptions } from './default.config';

export enum NgxOtpStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
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
    AriaLabelsDirective,
  ],
  selector: 'ngx-otp-input',
  templateUrl: 'ngx-otp-input.component.html',
  styleUrls: ['ngx-otp-input.component.scss'],
})
export class NgxOtpInputComponent implements OnInit, OnChanges {
  protected ngxOtpInputArray!: FormArray;
  protected ngxOtpOptions: NgxOtpInputComponentOptions = defaultOptions;

  @Input() set options(customOptions: NgxOtpInputComponentOptions) {
    this.ngxOtpOptions = { ...defaultOptions, ...customOptions };
  }

  @Input() status: NgxOtpStatus | null | undefined;
  @Input() disabled = false;
  @Input() otp: string | null | undefined;
  @Output() otpChange = new EventEmitter<string[]>();
  @Output() otpComplete = new EventEmitter<string>();

  // For testing purposes
  get ngxOtpOptionsInUse(): NgxOtpInputComponentOptions {
    return this.ngxOtpOptions;
  }

  get inputType(): string {
    return this.ngxOtpOptions.hideInputValues ? 'password' : 'text';
  }

  get isOTPSuccess(): boolean {
    return this.status === NgxOtpStatus.SUCCESS;
  }

  get isOTPFailed(): boolean {
    return this.status === NgxOtpStatus.FAILED;
  }

  ngOnInit(): void {
    this.initOtpInputArray();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const otpChange = changes['otp'];
    if (otpChange?.currentValue) {
      if (!otpChange.firstChange) {
        this.setInitialOtp(otpChange.currentValue);
      } else {
        this.ngxOtpOptions.autoFocus = false;
      }
    }
  }

  private initOtpInputArray(): void {
    this.ngxOtpInputArray = new FormArray(
      Array.from(
        { length: this.ngxOtpOptions.otpLength! },
        () => new FormControl('', Validators.required),
      ),
    );
    if (this.otp) {
      this.setInitialOtp(this.otp);
    }
  }

  private setInitialOtp(otp: string): void {
    if (this.ngxOtpOptions.regexp!.test(otp)) {
      const otpValueArray = otp.split('');
      otpValueArray.forEach((value, index) => {
        this.ngxOtpInputArray.controls[index].setValue(value ?? '');
      });
      this.emitOtpValueChange();
      if (otpValueArray.length !== this.ngxOtpOptions.otpLength) {
        console.warn(
          'OTP length does not match the provided otpLength option!',
        );
      }
    } else {
      throw new Error('Invalid OTP provided for the component <ngx-otp-input>');
    }
  }

  protected handleInputChanges($event: OtpValueChangeEvent) {
    const [index, value] = $event;
    this.ngxOtpInputArray.controls[index].setValue(value);
    this.emitOtpValueChange();
  }

  protected handlePasteChange($event: string[]): void {
    this.ngxOtpInputArray.setValue($event);
    this.emitOtpValueChange();
  }

  private emitOtpValueChange(): void {
    this.otpChange.emit(this.ngxOtpInputArray.value);
    if (this.ngxOtpInputArray.valid) {
      this.otpComplete.emit(this.ngxOtpInputArray.value.join(''));
    }
  }

  protected isInputFilled(index: number): boolean {
    return !!this.ngxOtpInputArray.controls[index].value;
  }

  reset(): void {
    this.ngxOtpInputArray.reset();
  }
}
