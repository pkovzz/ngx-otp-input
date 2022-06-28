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
      (e.code === 'KeyA' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.code === 'KeyC' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.code === 'KeyV' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.code === 'KeyX' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.code === 'KeyA' && e.metaKey === true) || // Cmd+A (Mac)
      (e.code === 'KeyC' && e.metaKey === true) || // Cmd+C (Mac)
      (e.code === 'KeyV' && e.metaKey === true) || // Cmd+V (Mac)
      (e.code === 'KeyX' && e.metaKey === true) // Cmd+X (Mac)
    ) {
      return; // let it happen, don't do anything
    } else if (!this.pattern.test(e.key)) {
      e.preventDefault();
    }
  }
}
