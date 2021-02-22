import { Component, Input, OnInit } from '@angular/core';
import { NgxOtpInputConfig } from './ngx-otp-input.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-otp-input',
  templateUrl: './ngx-otp-input.component.html',
  styleUrls: ['./ngx-otp-input.component.scss'],
})
export class NgxOtpInputComponent implements OnInit {
  @Input() config: NgxOtpInputConfig;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.config);
  }
}
