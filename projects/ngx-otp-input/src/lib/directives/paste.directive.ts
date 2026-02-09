import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxOtpPaste]',
})
export class PasteDirective {
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() regexp!: RegExp;

  @Output() handlePaste: EventEmitter<string[]> = new EventEmitter<string[]>();

  private readonly renderer = inject(Renderer2);

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text');
    if (clipboardData && this.regexp.test(clipboardData)) {
      if (this.regexp.global) {
        this.regexp.lastIndex = 0;
      }
      const values = clipboardData.split('');
      this.inputs.forEach((input, index) => {
        const nextValue = values[index] ?? '';
        this.renderer.setProperty(input.nativeElement, 'value', nextValue);
      });
      this.handlePaste.emit(values);
    }
  }
}
