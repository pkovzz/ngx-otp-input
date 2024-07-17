import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { OtpValueChangeEvent } from './inputNavigations.directive';

@Directive({
  standalone: true,
  selector: '[ngxOtpPaste]',
})
export class PasteDirective {
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() regexp!: RegExp;

  @Output() valueChange: EventEmitter<OtpValueChangeEvent> =
    new EventEmitter<OtpValueChangeEvent>();

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.handlePaste(event.clipboardData?.getData('text'));
  }

  private handlePaste(value: string | undefined): void {
    if (value && this.regexp.test(value)) {
      const values = value.split('');
      this.inputs.forEach((input, index) => {
        if (values[index]) {
          input.nativeElement.value = values[index];
          this.valueChange.emit([index, values[index]]);
        }
      });
    }
  }
}
