import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgxOtpInputConfig, NgxOtpStatus } from './ngx-otp-input.model';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-otp-input',
  templateUrl: './ngx-otp-input.component.html',
  styleUrls: ['./ngx-otp-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxOtpInputComponent implements OnInit, AfterViewInit, OnDestroy {
  private valueSubject = new BehaviorSubject<string>(null);
  private ngxOtpArray = new FormArray([]);
  private focusedInputHasValue = false;
  private lastFocus = 0;
  private defaultAriaLabel = 'One time password input';
  private isDisabled: boolean;
  private ngxOtpStatus: NgxOtpStatus;

  ariaLabels = [];
  classList = [];
  pattern: RegExp;

  get ngxOtpArrayControls(): FormControl[] {
    return this.ngxOtpArray.controls as FormControl[];
  }

  @Input() config: NgxOtpInputConfig;

  @Input() set value(value: any) {
    if (value) {
      this.valueSubject.next(value.toString());
    }
  }

  @Input() set status(status: NgxOtpStatus) {
    this.ngxOtpStatus = status;
    this.setInputClasses();
  }

  @Input() set disable(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.handleDisable(isDisabled);
  }

  @Output() otpChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() fill: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('otpInputElement') otpInputElements: QueryList<ElementRef>;

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.setValue(event.clipboardData.getData('text'));
  }

  constructor() {}

  ngOnInit(): void {
    this.setUpOtpForm();
    this.setUpAriaLabels();
    this.setInputClasses();
  }

  ngAfterViewInit(): void {
    const v = this.valueSubject.getValue();
    if (this.config.autofocus && v === null) {
      this.setFocus(0);
    } else if (v !== null) {
      this.setFocusAfterValueSet(v.length - 1);
    }

    this.otpFormChangeListener();
  }

  ngOnDestroy(): void {
    this.valueSubject.unsubscribe();
  }

  getAriaLabelByIndex(index: number): string {
    return this.ariaLabels[index]
      ? this.ariaLabels[index]
      : this.defaultAriaLabel;
  }

  handleFocus(index: number): void {
    this.lastFocus = index;
    this.getInputElementByIndex(index).select();
  }

  handleKeyup(value: string, index: number): void {
    if (this.pattern.test(value)) {
      this.stepForward(index);
    } else if (value === 'Backspace') {
      this.stepBackward(index);
    }

    this.setInputClasses();
  }

  handleKeydown(index: number): void {
    this.focusedInputHasValue = !!this.getFormControlByIndex(index).value;
  }

  handleLeftArrow(index: number): void {
    if (index > 0) {
      this.setFocus(index - 1);
    }
  }

  handleRightArrow(index: number): void {
    if (index < this.config.otpLength - 1) {
      this.setFocus(index + 1);
    }
  }

  private setUpOtpForm(): void {
    for (let i = 0; i < this.config.otpLength; i++) {
      this.ngxOtpArray.push(new FormControl(null, [Validators.required]));
    }

    this.pattern = this.config.pattern || /^\d+$/;
    this.valueSubject.subscribe((v) => this.setValue(v, true));
  }

  private setUpAriaLabels(): void {
    if (this.config.ariaLabels) {
      Array.isArray(this.config.ariaLabels)
        ? (this.ariaLabels = this.config.ariaLabels)
        : (this.ariaLabels = new Array(this.config.otpLength).fill(
            this.config.ariaLabels
          ));
    }
  }

  private setInputClasses(): void {
    const a = [];
    const c = this.config.classList;

    for (let i = 0; i < this.config.otpLength; i++) {
      const isFilled = this.isInputFilled(i)
        ? this.config.classList?.inputFilled
        : '';

      const isDisabled = this.isDisabled
        ? this.config.classList?.inputDisabled || 'ngx-otp-input-disabled'
        : '';

      let status: string | string[] = '';

      if (this.ngxOtpStatus === 'success') {
        status = this.config.classList.inputSuccess;
      } else if (this.ngxOtpStatus === 'error') {
        status = this.config.classList.inputError;
      }

      a[i] = [c?.input, isFilled, isDisabled, status];
    }

    this.classList = a;
  }

  private setValue(value: string, isDefaultValue = false): void {
    if (this.pattern.test(value)) {
      let lastIndex = 0;
      value
        .split('')
        .slice(0, this.config.otpLength)
        .map((character: string, index: number) => {
          this.setInputClasses();
          this.getFormControlByIndex(index).setValue(character);
          lastIndex = index;
        });

      if (!isDefaultValue) {
        this.setFocusAfterValueSet(lastIndex);
      }
    }
  }

  private handleDisable(disable: boolean): void {
    disable ? this.ngxOtpArray?.disable() : this.ngxOtpArray?.enable();
    this.setInputClasses();
  }

  private stepForward(index: number): void {
    if (this.ngxOtpArray.valid) {
      this.removeFocus(index);
    } else if (index < this.config.otpLength - 1) {
      this.setFocus(index + 1);
    }
  }

  private stepBackward(index: number): void {
    if (!this.focusedInputHasValue && index > 0) {
      this.setFocus(index - 1);
    }
  }

  private setFocusAfterValueSet(lastIndex: number): void {
    if (lastIndex < this.config.otpLength - 1) {
      this.setFocus(lastIndex + 1);
    } else {
      this.removeFocus(this.lastFocus);
    }
  }

  private setFocus(index: number): void {
    this.getInputElementByIndex(index).focus();
  }

  private removeFocus(index: number): void {
    this.getInputElementByIndex(index).blur();
  }

  private isInputFilled(index: number): boolean {
    return this.getFormControlByIndex(index)?.valid;
  }

  private getInputElementByIndex(index: number): any {
    return this.otpInputElements.toArray()[index].nativeElement;
  }

  private getFormControlByIndex(index: number): FormControl {
    return this.ngxOtpArray.controls[index] as FormControl;
  }

  private otpFormChangeListener(): void {
    this.ngxOtpArray.valueChanges.subscribe((values) => {
      this.otpChange.emit(values);

      if (this.ngxOtpArray.valid) {
        this.fill.emit(values.join(''));
      }
    });
  }
}
