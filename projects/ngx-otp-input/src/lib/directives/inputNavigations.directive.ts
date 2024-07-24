import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from '@angular/core';

export type OtpValueChangeEvent = [number, string];

@Directive({
  standalone: true,
  selector: '[ngxInputNavigations]',
})
export class InputNavigationsDirective implements AfterContentInit {
  private readonly nonInputKeys = [
    'Alt',
    'Control',
    'Meta',
    'Shift',
    'CapsLock',
    'Backspace',
    'Escape',
    'ArrowLeft',
    'ArrowUp',
    'ArrowRight',
    'ArrowDown',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'ContextMenu',
    'Insert',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Tab',
    'Enter',
  ];

  private inputsArray: ElementRef<HTMLInputElement>[] = [];

  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() regexp!: RegExp;

  @Output() valueChange: EventEmitter<OtpValueChangeEvent> =
    new EventEmitter<OtpValueChangeEvent>();

  ngAfterContentInit() {
    this.inputsArray = this.inputs.toArray();
  }

  private findInputIndex(target: HTMLElement): number {
    return this.inputsArray.findIndex(
      (input) => input.nativeElement === target,
    );
  }

  private setFocus(index: number): void {
    if (index >= 0 && index < this.inputs.length) {
      this.inputsArray[index].nativeElement.focus();
    }
  }

  @HostListener('keydown.arrowLeft', ['$event'])
  onArrowLeft(event: KeyboardEvent): void {
    const index = this.findInputIndex(event.target as HTMLElement);
    if (index > 0) {
      this.setFocus(index - 1);
    }
  }

  @HostListener('keydown.arrowRight', ['$event'])
  onArrowRight(event: KeyboardEvent): void {
    const index = this.findInputIndex(event.target as HTMLElement);
    if (index < this.inputs.length - 1) {
      this.setFocus(index + 1);
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: KeyboardEvent): void {
    const index = this.findInputIndex(event.target as HTMLElement);
    if (index >= 0) {
      this.valueChange.emit([index, '']);
      this.setFocus(index - 1);
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      this.nonInputKeys.includes(event.key) ||
      (event.code === 'KeyA' && event.ctrlKey === true) || // Allow: Ctrl+A
      (event.code === 'KeyC' && event.ctrlKey === true) || // Allow: Ctrl+C
      (event.code === 'KeyV' && event.ctrlKey === true) || // Allow: Ctrl+V
      (event.code === 'KeyX' && event.ctrlKey === true) || // Allow: Ctrl+X
      (event.code === 'KeyA' && event.metaKey === true) || // Cmd+A (Mac)
      (event.code === 'KeyC' && event.metaKey === true) || // Cmd+C (Mac)
      (event.code === 'KeyV' && event.metaKey === true) || // Cmd+V (Mac)
      (event.code === 'KeyX' && event.metaKey === true) // Cmd+X (Mac)
    ) {
      return; // let it happen, don't do anything
    } else if (!this.regexp.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const index = this.findInputIndex(event.target as HTMLElement);
    if (
      event.key.match(this.regexp) &&
      !this.nonInputKeys.includes(event.key)
    ) {
      this.valueChange.emit([index, event.key]);
      this.setFocus(index + 1);
    }
  }
}
