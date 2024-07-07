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

export type ValueChangeEvent = [number, string];

@Directive({
  standalone: true,
  selector: '[ngxInputNavigations]',
})
export class InputNavigationsDirective implements AfterContentInit {
  private inputsArray: ElementRef<HTMLInputElement>[] = [];

  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input()
  regexp!: RegExp;

  @Output()
  valueChange: EventEmitter<ValueChangeEvent> =
    new EventEmitter<ValueChangeEvent>();

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
      !event.key.match(this.regexp) &&
      event.key !== 'Backspace' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    console.log(this.regexp);
    console.log(event.key.match(this.regexp));
    const index = this.findInputIndex(event.target as HTMLElement);
    if (event.key.match(this.regexp)) {
      this.valueChange.emit([index, event.key]);
      this.setFocus(index + 1);
    }
  }
}
