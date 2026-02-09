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
  onArrowLeft(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const index = this.findInputIndex(keyboardEvent.target as HTMLElement);
    if (index > 0) {
      this.setFocus(index - 1);
    }
  }

  @HostListener('keydown.arrowRight', ['$event'])
  onArrowRight(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const index = this.findInputIndex(keyboardEvent.target as HTMLElement);
    if (index < this.inputs.length - 1) {
      this.setFocus(index + 1);
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  onBackspace(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const index = this.findInputIndex(keyboardEvent.target as HTMLElement);
    if (index >= 0) {
      this.valueChange.emit([index, '']);
      this.setFocus(index - 1);
      keyboardEvent.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onKeyUp(event: Event): void {
    const inputEvent = event as InputEvent;
    const target = inputEvent.target as HTMLInputElement;
    const index = this.findInputIndex(target as HTMLElement);
    if (target.value?.match(this.regexp)) {
      this.valueChange.emit([index, target.value]);
      this.setFocus(index + 1);
    } else {
      this.inputsArray[index].nativeElement.value = '';
    }
  }
}
