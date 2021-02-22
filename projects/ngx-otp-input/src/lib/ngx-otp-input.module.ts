import { NgModule } from '@angular/core';
import { NgxOtpInputComponent } from './component/ngx-otp-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatternDirective } from './pattern.directive';

@NgModule({
  declarations: [NgxOtpInputComponent, PatternDirective],
  imports: [ReactiveFormsModule, CommonModule],
  exports: [NgxOtpInputComponent],
})
export class NgxOtpInputModule {}
