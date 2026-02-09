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
  selector: '[ngxAutoFocus]',
})
export class AutoFocusDirective
  implements AfterContentInit, OnChanges, OnDestroy
{
  @ContentChildren('otpInputElement', { descendants: true })
  inputs!: QueryList<ElementRef<HTMLInputElement>>;

  @Input() ngxAutoFocus!: boolean;

  private inputsChangesSub?: Subscription;

  ngAfterContentInit(): void {
    this.focusFirstInput();
    this.inputsChangesSub = this.inputs.changes.subscribe(() => {
      this.focusFirstInput();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ngxAutoFocus']?.currentValue) {
      this.focusFirstInput();
    }
  }

  ngOnDestroy(): void {
    this.inputsChangesSub?.unsubscribe();
  }

  private focusFirstInput(): void {
    if (!this.ngxAutoFocus) {
      return;
    }
    const firstInput = this.inputs?.first;
    if (firstInput) {
      firstInput.nativeElement.focus();
    }
  }
}
