import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ngxOtpPattern]',
})
export class PatternDirective {
  // allowed keys apart from numeric characters
  private allowedKeys = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'Escape',
    'Tab',
  ];

  @Input('ngxOtpPattern') pattern: RegExp;

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (
      this.allowedKeys.includes(e.key) ||
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return; // let it happen, don't do anything
    } else if (!this.pattern.test(e.key)) {
      e.preventDefault();
    }
  }
}
