import {
  Input,
  OnInit,
  Output,
  Component,
  OnDestroy,
  QueryList,
  ElementRef,
  ViewChildren,
  EventEmitter,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxOtpInputService } from '../ngx-otp-input.service';
import {
  NgxOtpStatus,
  NgxOtpBehavior,
  NgxOtpInputConfig,
} from './ngx-otp-input.model';

@Component({
  selector: 'ngx-otp-input',
  templateUrl: './ngx-otp-input.component.html',
  styleUrls: ['./ngx-otp-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxOtpInputComponent implements OnInit, AfterViewInit, OnDestroy {
  ngxOtpArray = new UntypedFormArray([]);
  ariaLabels: string[] = [];
  pattern!: RegExp;
  styles: string[][] = [];

  otpConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    autoblur: true,
    behavior: NgxOtpBehavior.DEFAULT,
  };

  private defaultPattern = /^\d+$/;
  private DEFAULT_ARIA_LABEL = 'One time password input';
  private LAST_INPUT_INDEX!: number;
  private inputs!: HTMLInputElement[];
  private isNgxOtpArrayDisabled = false;
  private ngxOtpArray$!: Subscription;
  private focusedInputHasValue = false;

  @ViewChildren('otpInputElement') otpInputElements: QueryList<ElementRef>;

  @Output() otpChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() fill: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.handlePaste(event.clipboardData.getData('text'));
  }

  @Input() set disable(isDisabled: boolean) {
    this.handleDisable(isDisabled);
    this.isNgxOtpArrayDisabled = isDisabled;
  }

  @Input() set config(c: NgxOtpInputConfig) {
    this.otpConfig = { ...this.otpConfig, ...c };
    if (this.otpConfig.classList?.input) {
      this.setInitialStyles();
    }
    if (!c.pattern) {
      this.otpConfig.pattern = this.defaultPattern;
    }
  }

  @Input() set status(status: NgxOtpStatus) {
    this.handleStatusChange(status);
  }

  constructor(
    private readonly ngxOtpInputService: NgxOtpInputService,
    private readonly ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setUpOtpForm();
    this.setUpAriaLabels();
    this.LAST_INPUT_INDEX = this.otpConfig.otpLength - 1;
    this.otpFormChangeListener();
  }

  ngAfterViewInit(): void {
    this.setNativeHTMLElements();
    this.setInitialFocus();
    this.setNumericInputIfPossible();
    this.handleDisable(this.isNgxOtpArrayDisabled);
  }

  ngOnDestroy(): void {
    this.ngxOtpArray$.unsubscribe();
  }

  clear(): void {
    this.removeStyleFromAll(this.otpConfig.classList?.inputFilled);
    this.ngxOtpArray.reset();
    this.ref.detectChanges();

    if (this.otpConfig.autofocus) {
      this.setFocus(0);
    }
  }

  handleKeyUp(index: number, value: string): void {
    if (this.otpConfig.pattern.test(value) && value !== 'Backspace') {
      this.addStyle(index, this.otpConfig.classList?.inputFilled);
      if (!this.ngxOtpArray.valid) {
        this.getFormControlByIndex(index).setValue(value);
        this.stepForward(index);
      } else {
        this.blur();
      }
    }
  }

  handleDelete(index: number): void {
    this.removeStyle(index, this.otpConfig.classList?.inputFilled);
    if (
      (this.otpConfig.behavior === NgxOtpBehavior.LEGACY &&
        !this.focusedInputHasValue) ||
      this.otpConfig.behavior !== NgxOtpBehavior.LEGACY
    ) {
      this.stepBackward(index);
    } else {
      this.focusedInputHasValue = false;
    }
  }

  handleFocus(index: number): void {
    this.focusedInputHasValue = !!this.ngxOtpArray.controls[index].value;
    if (
      this.otpConfig.behavior === NgxOtpBehavior.LEGACY &&
      this.focusedInputHasValue
    ) {
      this.inputs[index].select();
    }
  }

  stepBackward(index: number): void {
    if (index > 0) {
      this.setFocus(index - 1);
    }
  }

  stepForward(index: number): void {
    if (index < this.LAST_INPUT_INDEX) {
      this.setFocus(index + 1);
    }
  }

  private otpFormChangeListener(): void {
    this.ngxOtpArray$ = this.ngxOtpArray.valueChanges.subscribe((values) => {
      this.otpChange.emit(values);

      if (this.ngxOtpArray.valid) {
        this.fill.emit(values.join(''));
      }
    });
  }

  private setUpOtpForm(): void {
    for (let i = 0; i < this.otpConfig.otpLength; i++) {
      this.ngxOtpArray.push(
        new UntypedFormControl(null, [Validators.required])
      );
    }
  }

  private setUpAriaLabels(): void {
    const labels = this.otpConfig.ariaLabels;

    this.ariaLabels = Array.isArray(labels)
      ? labels
      : new Array(this.otpConfig.otpLength).fill(
          labels || this.DEFAULT_ARIA_LABEL
        );
  }

  private setNativeHTMLElements(): void {
    this.inputs = this.otpInputElements.map((element) => element.nativeElement);
  }

  private setInitialFocus(): void {
    if (this.otpConfig.autofocus) {
      this.setFocus(0);
    }
  }

  private setInitialStyles(): void {
    this.styles = this.ngxOtpInputService.init2DArray(this.otpConfig.otpLength);
    this.addStyleToAll(this.otpConfig.classList.input);
  }

  private setFocus(index: number): void {
    this.inputs[index].focus();
  }

  private setNumericInputIfPossible(): void {
    if (this.otpConfig.numericInputMode) {
      this.otpConfig.pattern = this.defaultPattern;
      this.inputs.map((element) => {
        element.setAttribute('inputmode', 'numeric');
        element.setAttribute('pattern', '[0-9]*');
      });
    }
  }

  private blur(): void {
    if (this.otpConfig.autoblur) {
      this.inputs.map((input) => input.blur());
    }
  }

  private handlePaste(value: string): void {
    if (this.otpConfig.pattern.test(value)) {
      let lastIndex = 0;
      value
        .split('')
        .slice(0, this.otpConfig.otpLength)
        .map((character: string, index: number) => {
          this.addStyle(index, this.otpConfig.classList?.inputFilled);
          this.getFormControlByIndex(index).setValue(character);
          lastIndex = index;
        });

      if (this.ngxOtpArray.valid) {
        this.blur();
      } else {
        this.setFocus(lastIndex + 1);
      }
    }
  }

  private handleDisable(isDisabled: boolean): void {
    if (isDisabled) {
      this.ngxOtpArray.disable();
      this.addStyleToAll(this.otpConfig.classList?.inputDisabled);
    } else {
      this.ngxOtpArray.enable();
      this.removeStyleFromAll(this.otpConfig.classList?.inputDisabled);
    }
  }

  private handleStatusChange(status: NgxOtpStatus): void {
    this.removeStyleFromAll([
      ...this.ngxOtpInputService.toArray(
        this.otpConfig.classList?.inputSuccess
      ),
      ...this.ngxOtpInputService.toArray(this.otpConfig.classList?.inputError),
    ]);

    if (status) {
      if (status === 'success') {
        this.addStyleToAll(this.otpConfig.classList?.inputSuccess);
      } else if (status === 'error') {
        this.addStyleToAll(this.otpConfig.classList?.inputError);
      }
    }
  }

  private getFormControlByIndex(index: number): UntypedFormControl {
    return this.ngxOtpArray.controls[index] as UntypedFormControl;
  }

  private addStyle(index: number, styles: string | string[]): void {
    this.styles = this.ngxOtpInputService.addItemAtIndex(
      this.styles,
      index,
      this.ngxOtpInputService.toArray(styles)
    );
  }

  private addStyleToAll(styles: string | string[]): void {
    this.styles = this.ngxOtpInputService.addItemToAll(
      this.styles,
      this.ngxOtpInputService.toArray(styles)
    );
  }

  private removeStyle(index: number, styles: string | string[]): void {
    this.styles = this.ngxOtpInputService.removeItemAtIndex(
      this.styles,
      index,
      this.ngxOtpInputService.toArray(styles)
    );
  }

  private removeStyleFromAll(styles: string | string[]): void {
    this.styles = this.ngxOtpInputService.removeItemFromAll(
      this.styles,
      this.ngxOtpInputService.toArray(styles)
    );
  }
}
