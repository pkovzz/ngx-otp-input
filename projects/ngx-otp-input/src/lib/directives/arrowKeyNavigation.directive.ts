import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  QueryList,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxArrowKeyNavigation]',
})
export class ArrowKeyNavigationDirective implements AfterContentInit {
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  private inputsArray: ElementRef<HTMLInputElement>[] = [];

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
}
