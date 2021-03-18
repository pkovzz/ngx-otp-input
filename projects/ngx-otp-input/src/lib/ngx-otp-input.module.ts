import { NgModule } from '@angular/core';
import { NgxOtpInputComponent } from './component/ngx-otp-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatternDirective } from './pattern.directive';

@NgModule({
  declarations: [NgxOtpInputComponent, PatternDirective],
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  exports: [NgxOtpInputComponent],
})
export class NgxOtpInputModule {}
