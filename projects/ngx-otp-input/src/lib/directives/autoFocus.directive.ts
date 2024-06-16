import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  Input,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxAutoFocus]',
})
export class AutoFocusDirective implements AfterContentInit {
  @ContentChild('otpInputElement', { static: false })
  firstInput!: ElementRef<HTMLInputElement>;

  @Input() ngxAutoFocus!: boolean;

  ngAfterContentInit(): void {
    if (this.ngxAutoFocus && this.firstInput) {
      this.firstInput.nativeElement.focus();
    }
  }
}
