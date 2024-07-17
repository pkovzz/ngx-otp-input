import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxAutoBlur]',
})
export class AutoBlurDirective implements OnChanges, AfterContentInit {
  private inputHTMLElements: HTMLInputElement[] = [];

  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input()
  ngxAutoBlur!: boolean;

  @Input()
  isFormValid!: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.ngxAutoBlur &&
      this.inputHTMLElements.length > 0 &&
      changes['isFormValid'].currentValue
    ) {
      this.inputHTMLElements.forEach((input) => {
        input.blur();
      });
    }
  }

  ngAfterContentInit() {
    this.inputs.forEach((input) => {
      this.inputHTMLElements.push(input.nativeElement);
    });
  }
}
