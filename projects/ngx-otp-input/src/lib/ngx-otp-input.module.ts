import { NgModule } from '@angular/core';
import { NgxOtpInputComponent } from './component/ngx-otp-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NgxOtpInputComponent],
  imports: [ReactiveFormsModule, CommonModule],
  exports: [NgxOtpInputComponent],
})
export class NgxOtpInputModule {}
