import {
  Directive,
  Input,
  ElementRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxOtpAriaLabels]',
})
export class AriaLabelsDirective implements AfterContentInit {
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() ngxOtpAriaLabels!: string[];

  ngAfterContentInit(): void {
    this.setAriaLabelsAttrs();
  }

  private getDefaultAriaLabelText(index: number): string {
    return `One Time Password Input Number ${index + 1}`;
  }

  private setAriaLabelsAttrs(): void {
    this.inputs.forEach((input, index) => {
      input.nativeElement.setAttribute(
        'aria-label',
        this.ngxOtpAriaLabels[index] ?? this.getDefaultAriaLabelText(index),
      );
    });
  }
}
