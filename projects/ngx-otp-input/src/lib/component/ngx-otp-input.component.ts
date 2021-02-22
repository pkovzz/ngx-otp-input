import { Component, Input, OnInit } from '@angular/core';
import { NgxOtpInputConfig } from './ngx-otp-input.model';
import { FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-otp-input',
  templateUrl: './ngx-otp-input.component.html',
  styleUrls: ['./ngx-otp-input.component.scss'],
})
export class NgxOtpInputComponent implements OnInit {
  @Input() config: NgxOtpInputConfig;

  ariaLabels = [];
  pattern: RegExp;

  get ngxOtpArrayControls(): FormControl[] {
    return this.ngxOtpArray.controls as FormControl[];
  }

  private ngxOtpArray = new FormArray([]);

  constructor() {}

  ngOnInit(): void {
    this.initOtpForm();
  }

  private initOtpForm(): void {
    for (let i = 0; i < this.config.otpLength; i++) {
      this.ngxOtpArray.push(new FormControl(null, [Validators.required]));
    }

    this.pattern = this.config.pattern || /^\d+$/;
  }
}
