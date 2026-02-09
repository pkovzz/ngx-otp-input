import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[ngxAutoBlur]',
})
export class AutoBlurDirective
  implements OnChanges, AfterContentInit, OnDestroy
{
  private inputHTMLElements: HTMLInputElement[] = [];
  private inputsChangesSub?: Subscription;

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
      changes['isFormValid']?.currentValue
    ) {
      this.inputHTMLElements.forEach((input) => {
        input.blur();
      });
    }
  }

  ngAfterContentInit() {
    this.updateInputElements();
    this.inputsChangesSub = this.inputs.changes.subscribe(() => {
      this.updateInputElements();
    });
  }

  ngOnDestroy(): void {
    this.inputsChangesSub?.unsubscribe();
  }

  private updateInputElements(): void {
    this.inputHTMLElements = this.inputs
      .toArray()
      .map((input) => input.nativeElement);
  }
}
