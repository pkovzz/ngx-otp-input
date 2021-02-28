import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgxOtpInputConfig } from './ngx-otp-input.model';
import { FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-otp-input',
  templateUrl: './ngx-otp-input.component.html',
  styleUrls: ['./ngx-otp-input.component.scss'],
})
export class NgxOtpInputComponent implements OnInit, AfterViewInit {
  private ngxOtpArray = new FormArray([]);
  private focusedInputHasValue = false;
  private lastFocus = 0;
  private defaultAriaLabel = 'One time password input';

  ariaLabels = [];
  classList = [];
  pattern: RegExp;

  get ngxOtpArrayControls(): FormControl[] {
    return this.ngxOtpArray.controls as FormControl[];
  }

  @Input() config: NgxOtpInputConfig;

  @ViewChildren('otpInputElement') otpInputElements: QueryList<ElementRef>;

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.setValue(event.clipboardData.getData('text'));
  }

  constructor() {}

  ngOnInit(): void {
    this.setUpOtpForm();
    this.setUpAriaLabels();
    this.setInitialInputClasses();
  }

  ngAfterViewInit(): void {
    if (this.config.autofocus) {
      this.setFocus(0);
    }
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
      this.setFilledStyles(index);
      this.stepForward(index);
    } else if (value === 'Backspace') {
      this.removeFilledStyles(index);
      this.stepBackward(index);
    }
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

  private setInitialInputClasses(): void {
    this.classList = new Array(this.config.otpLength).fill(
      this.config.classList?.input
    );
  }

  private setValue(value: string): void {
    if (this.pattern.test(value)) {
      let lastIndex = 0;
      value
        .split('')
        .slice(0, this.config.otpLength)
        .map((character: string, index: number) => {
          this.setFilledStyles(index);
          this.getFormControlByIndex(index).setValue(character);
          lastIndex = index;
        });

      if (lastIndex < this.config.otpLength - 1) {
        this.setFocus(lastIndex + 1);
      } else {
        this.removeFocus(this.lastFocus);
      }
    }
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

  private setFocus(index: number): void {
    this.getInputElementByIndex(index).focus();
  }

  private removeFocus(index: number): void {
    this.getInputElementByIndex(index).blur();
  }

  private setFilledStyles(index: number): void {
    this.classList[index] = this.classList[index].concat(
      this.config.classList?.inputFilled
    );
  }

  private removeFilledStyles(index: number): void {
    this.classList[index] = this.classList[index].filter((className) => {
      return !this.config.classList?.inputFilled.includes(className);
    });
  }

  private getInputElementByIndex(index: number): any {
    return this.otpInputElements.toArray()[index].nativeElement;
  }

  private getFormControlByIndex(index: number): FormControl {
    return this.ngxOtpArray.controls[index] as FormControl;
  }
}
