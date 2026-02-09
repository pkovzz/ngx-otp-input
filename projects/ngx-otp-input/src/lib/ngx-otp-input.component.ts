import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  defaultV2,
  OtpChangeEvent,
  OtpInvalidEvent,
  OtpStatus,
  OtpStatusMessages,
} from './default.config';

let nextStatusId = 0;

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'ngx-otp-input',
  templateUrl: 'ngx-otp-input.component.html',
  styleUrls: ['ngx-otp-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxOtpInputComponent),
      multi: true,
    },
  ],
})
export class NgxOtpInputComponent
  implements ControlValueAccessor, OnChanges, AfterViewInit
{
  private value = '';
  isDisabled = false;
  hasInvalidOtp = false;
  readonly statusMessageId = `ngx-otp-input-status-${nextStatusId++}`;

  @ViewChild('otpInput', { static: true })
  private otpInput?: ElementRef<HTMLInputElement>;

  @Input() length = defaultV2.length;
  @Input() autoFocus = defaultV2.autoFocus;
  @Input() autoBlur = defaultV2.autoBlur;
  @Input() mask = defaultV2.mask;
  @Input() charPattern: RegExp = defaultV2.charPattern;
  @Input() inputMode = defaultV2.inputMode;
  @Input() ariaLabel = defaultV2.ariaLabel;
  @Input() status: OtpStatus = 'idle';
  @Input() statusMessages: OtpStatusMessages = defaultV2.statusMessages;

  @Output() otpChange = new EventEmitter<OtpChangeEvent>();
  @Output() otpComplete = new EventEmitter<string>();
  @Output() otpInvalid = new EventEmitter<OtpInvalidEvent>();

  private readonly cdr = inject(ChangeDetectorRef);

  get inputType(): string {
    return this.mask ? 'password' : 'text';
  }

  get statusMessage(): string {
    if (this.status === 'success') {
      return this.statusMessages?.success ?? defaultV2.statusMessages.success;
    }
    if (this.status === 'error') {
      return this.statusMessages?.error ?? defaultV2.statusMessages.error;
    }
    return '';
  }

  private get isComplete(): boolean {
    return this.value.length === this.resolvedLength;
  }

  get characters(): string[] {
    const chars = this.value.split('');
    return Array.from({ length: this.resolvedLength }, (_, index) => {
      return chars[index] ?? '';
    });
  }

  get activeIndex(): number {
    return Math.min(this.value.length, Math.max(0, this.resolvedLength - 1));
  }

  get boxes(): number[] {
    return Array.from({ length: this.resolvedLength }, (_, index) => index);
  }

  get patternAttribute(): string | null {
    const source = this.charPattern?.source ?? '';
    if (!source) {
      return null;
    }
    const unanchored = source.replace(/^\^/, '').replace(/\$$/, '');
    return `(?:${unanchored}){0,${this.resolvedLength}}`;
  }

  get resolvedLength(): number {
    const length = Number.isFinite(this.length)
      ? Math.max(1, Math.floor(this.length))
      : defaultV2.length;
    return length;
  }

  ngAfterViewInit(): void {
    if (this.autoFocus && !this.isDisabled) {
      queueMicrotask(() => this.otpInput?.nativeElement.focus());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['length'] || changes['charPattern']) {
      const result = this.sanitize(this.value);
      if (result.accepted !== this.value) {
        this.value = result.accepted;
        this.onChange(this.value);
      }
      this.syncNativeInputValue();
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string | null): void {
    this.value = this.sanitize(value ?? '').accepted;
    this.hasInvalidOtp = false;
    this.cdr.markForCheck();
    this.syncNativeInputValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  handleContainerMouseDown(event: MouseEvent): void {
    event.preventDefault();
    if (!this.isDisabled) {
      this.otpInput?.nativeElement.focus();
    }
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const result = this.sanitize(target.value ?? '');

    this.hasInvalidOtp = !!result.rejectedReason;
    if (result.rejectedReason) {
      this.otpInvalid.emit({
        reason: result.rejectedReason,
        attemptedValue: result.attempted,
        acceptedValue: result.accepted,
      });
    }

    this.setValueFromUser(result.accepted);
    this.syncNativeInputValue();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.value.length > 0) {
        this.setValueFromUser(this.value.slice(0, -1));
        this.syncNativeInputValue();
      }
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    if (this.isDisabled) {
      return;
    }
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const result = this.sanitize(text);

    this.hasInvalidOtp = !!result.rejectedReason;
    if (result.rejectedReason) {
      this.otpInvalid.emit({
        reason: result.rejectedReason,
        attemptedValue: result.attempted,
        acceptedValue: result.accepted,
      });
    }

    this.setValueFromUser(result.accepted);
    this.syncNativeInputValue();
  }

  handleBlur(): void {
    this.onTouched();
  }

  reset(): void {
    this.setValueFromUser('');
    this.syncNativeInputValue();
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private setValueFromUser(nextValue: string): void {
    this.value = nextValue;
    this.onChange(this.value);
    this.otpChange.emit({ value: this.value, isComplete: this.isComplete });

    if (this.isComplete) {
      this.otpComplete.emit(this.value);
      if (this.autoBlur) {
        this.otpInput?.nativeElement.blur();
      }
    }

    this.cdr.markForCheck();
  }

  private sanitize(value: string): {
    attempted: string;
    accepted: string;
    rejectedReason?: OtpInvalidEvent['reason'];
  } {
    const attempted = value ?? '';
    const chars = attempted.split('');
    let rejectedReason: OtpInvalidEvent['reason'] | undefined;

    const acceptedChars: string[] = [];
    for (const ch of chars) {
      if (acceptedChars.length >= this.resolvedLength) {
        rejectedReason = rejectedReason ?? 'too-long';
        continue;
      }
      if (!this.isCharAllowed(ch)) {
        rejectedReason = rejectedReason ?? 'char-rejected';
        continue;
      }
      acceptedChars.push(ch);
    }

    return { attempted, accepted: acceptedChars.join(''), rejectedReason };
  }

  private isCharAllowed(ch: string): boolean {
    const isValid = this.charPattern.test(ch);
    if (this.charPattern.global) {
      this.charPattern.lastIndex = 0;
    }
    return isValid;
  }

  private syncNativeInputValue(): void {
    const input = this.otpInput?.nativeElement;
    if (input && input.value !== this.value) {
      input.value = this.value;
    }
  }
}
