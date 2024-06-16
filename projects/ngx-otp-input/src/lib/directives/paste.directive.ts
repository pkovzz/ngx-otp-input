import {
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  QueryList,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxOtpPaste]',
})
export class PasteDirective {
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.handlePaste(event.clipboardData?.getData('text'));
  }

  private handlePaste(value: string | undefined): void {
    if (value) {
      const values = value.split('');
      this.inputs.forEach((input, index) => {
        if (values[index]) {
          input.nativeElement.value = values[index];
        }
      });
    }
  }
}
