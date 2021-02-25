import {
  AfterViewInit,
  Component,
  ElementRef,
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
  @ViewChildren('otpInputElement') otpInputElements: QueryList<ElementRef>;

  @Input() config: NgxOtpInputConfig;

  ariaLabels = [];
  pattern: RegExp;

  get ngxOtpArrayControls(): FormControl[] {
    return this.ngxOtpArray.controls as FormControl[];
  }

  private ngxOtpArray = new FormArray([]);
  private defaultAriaLabel = 'One time password input';

  constructor() {}

  ngOnInit(): void {
    this.setUpOtpForm();
    this.setUpAriaLabels();
  }

  ngAfterViewInit(): void {
    if (this.config.autofocus) {
      this.setFocus(0);
    }
  }

  getAriaLabelByIndex(currentIndex: number): string {
    return this.ariaLabels[currentIndex]
      ? this.ariaLabels[currentIndex]
      : this.defaultAriaLabel;
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

  private setFocus(index: number): void {
    this.getInputElementByIndex(index).focus();
  }

  private removeFocus(index: number): void {
    this.getInputElementByIndex(index).blur();
  }

  private getInputElementByIndex(index: number): HTMLElement {
    return this.otpInputElements.toArray()[index].nativeElement;
  }
}
