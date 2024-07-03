import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { AriaLabelsDirective } from './directives/ariaLabels.directive';
import defaultConfig from './default.config';

export interface NgxOtpInputComponentConfig {
  otpLength: number;
  autoFocus?: boolean;
  autoBlur?: boolean;
  hideInputValues?: boolean;
  regexp?: RegExp;
  blinkingCursor?: boolean;
  ariaLabels?: string[];
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
export class NgxOtpInputComponent implements OnInit {
  @Input() config: NgxOtpInputComponentConfig = defaultConfig;
  @Input() disabled = false;
  @Output() otpChange = new EventEmitter<string[]>();
  @Output() otpComplete = new EventEmitter<string>();

  protected ngxOtpInputArray!: FormArray;

  get inputType(): string {
    return this.config.hideInputValues ? 'password' : 'text';
  }

  ngOnInit(): void {
    this.initOtpInputArray();
  }

  private initOtpInputArray(): void {
    this.ngxOtpInputArray = new FormArray(
      Array.from(
        { length: this.config.otpLength },
        () => new FormControl('', Validators.required),
      ),
    );
  }

  handleInputChanges($event: ValueChangeEvent) {
    const [index, value] = $event;
    this.ngxOtpInputArray.controls[index].setValue(value);
    this.otpChange.emit(this.ngxOtpInputArray.value);
    if (this.ngxOtpInputArray.valid) {
      this.otpComplete.emit(this.ngxOtpInputArray.value.join(''));
    }
  }
}
