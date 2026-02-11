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
  signal,
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
  private readonly valueState = signal('');
  private readonly caretIndexState = signal<number | null>(null);
  private readonly isDisabledState = signal(false);
  private readonly hasInvalidOtpState = signal(false);
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

  private get value(): string {
    return this.valueState();
  }

  private set value(nextValue: string) {
    this.valueState.set(nextValue);
  }

  private get caretIndex(): number | null {
    return this.caretIndexState();
  }

  private set caretIndex(nextIndex: number | null) {
    this.caretIndexState.set(nextIndex);
  }

  get isDisabled(): boolean {
    return this.isDisabledState();
  }

  get hasInvalidOtp(): boolean {
    return this.hasInvalidOtpState();
  }

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

  get displayCharacters(): string[] {
    return this.characters.map((char) => {
      if (this.mask && char) {
        return '•';
      }
      return char;
    });
  }

  get activeIndex(): number {
    const fallbackIndex = this.value.length;
    const caretIndex = this.caretIndex ?? fallbackIndex;
    return Math.min(
      Math.max(0, caretIndex),
      Math.max(0, this.resolvedLength - 1),
    );
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
      this.setCaretIndex(this.value.length);
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string | null): void {
    this.value = this.sanitize(value ?? '').accepted;
    this.hasInvalidOtpState.set(false);
    this.cdr.markForCheck();
    this.syncNativeInputValue();
    this.setCaretIndex(this.value.length);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledState.set(isDisabled);
    this.cdr.markForCheck();
  }

  handleContainerPointerDown(event: PointerEvent): void {
    if (this.isDisabled) {
      return;
    }

    this.otpInput?.nativeElement.focus();

    if (event.pointerType === 'mouse') {
      event.preventDefault();
      queueMicrotask(() => this.setCaretIndex(this.value.length));
    }
  }

  handleBoxPointerDown(event: PointerEvent, index: number): void {
    if (this.isDisabled) {
      return;
    }
    if (event.pointerType !== 'mouse') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.otpInput?.nativeElement.focus();
    const nextIndex = Math.min(index, this.value.length);
    this.setCaretIndex(nextIndex);
    queueMicrotask(() => this.setCaretIndex(nextIndex));
  }

  handleBeforeInput(event: InputEvent): void {
    if (this.isDisabled) {
      return;
    }

    const isPasteLikeInput =
      event.inputType === 'insertFromPaste' ||
      event.inputType === 'insertReplacementText';
    if (!isPasteLikeInput) {
      return;
    }

    const input = this.otpInput?.nativeElement;
    const insertedText =
      event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
    if (!insertedText) {
      // iOS can omit payload in beforeinput/paste for security reasons.
      // Select all so native insertion replaces existing value.
      try {
        input?.setSelectionRange(0, input.value.length);
      } catch {
        // Ignore selection errors for unsupported input types.
      }
      return;
    }

    event.preventDefault();
    this.applyPastedValue(insertedText);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const result = this.sanitize(target.value ?? '');

    this.hasInvalidOtpState.set(!!result.rejectedReason);
    if (result.rejectedReason) {
      this.otpInvalid.emit({
        reason: result.rejectedReason,
        attemptedValue: result.attempted,
        acceptedValue: result.accepted,
      });
    }

    this.setValueFromUser(result.accepted);
    this.syncNativeInputValue();
    this.setCaretIndex(target.selectionStart ?? this.value.length);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      return;
    }
    const input = this.otpInput?.nativeElement;
    const selectionStart = input?.selectionStart ?? this.value.length;
    const selectionEnd = input?.selectionEnd ?? selectionStart;

    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      if (!this.isCharAllowed(event.key)) {
        this.hasInvalidOtpState.set(true);
        this.otpInvalid.emit({
          reason: 'char-rejected',
          attemptedValue: event.key,
          acceptedValue: this.value,
        });
        this.cdr.markForCheck();
        return;
      }

      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      let nextValue = this.value;

      if (start < this.value.length) {
        nextValue =
          this.value.slice(0, start) +
          event.key +
          this.value.slice(
            Math.min(end + (start === end ? 1 : 0), this.value.length),
          );
      } else if (this.value.length < this.resolvedLength) {
        nextValue = this.value + event.key;
      }

      const sanitized = this.sanitize(nextValue);
      this.hasInvalidOtpState.set(!!sanitized.rejectedReason);
      if (sanitized.rejectedReason) {
        this.otpInvalid.emit({
          reason: sanitized.rejectedReason,
          attemptedValue: sanitized.attempted,
          acceptedValue: sanitized.accepted,
        });
      }
      this.setValueFromUser(sanitized.accepted);
      this.syncNativeInputValue();
      this.setCaretIndex(start + 1);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.setCaretIndex(selectionStart - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.setCaretIndex(selectionStart + 1);
      return;
    }
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (selectionStart > 0) {
        const nextValue =
          this.value.slice(0, selectionStart - 1) +
          this.value.slice(selectionStart);
        this.setValueFromUser(nextValue);
        this.syncNativeInputValue();
        this.setCaretIndex(selectionStart - 1);
      }
      return;
    }
    if (event.key === 'Delete') {
      event.preventDefault();
      if (selectionStart < this.value.length) {
        const nextValue =
          this.value.slice(0, selectionStart) +
          this.value.slice(selectionStart + 1);
        this.setValueFromUser(nextValue);
        this.syncNativeInputValue();
        this.setCaretIndex(selectionStart);
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
    const text = event.clipboardData?.getData('text') ?? '';
    if (!text) {
      // Some mobile browsers (notably iOS Safari paste callout) can dispatch
      // paste without exposing clipboardData; select all so native insertion
      // replaces current value.
      const input = this.otpInput?.nativeElement;
      try {
        input?.setSelectionRange(0, input.value.length);
      } catch {
        // Ignore selection errors for unsupported input types.
      }
      return;
    }
    event.preventDefault();
    this.applyPastedValue(text);
  }

  handleBlur(): void {
    this.onTouched();
  }

  reset(): void {
    this.setValueFromUser('');
    this.syncNativeInputValue();
    this.setCaretIndex(0);
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

  private applyPastedValue(rawValue: string): void {
    const result = this.sanitize(rawValue);

    this.hasInvalidOtpState.set(!!result.rejectedReason);
    if (result.rejectedReason) {
      this.otpInvalid.emit({
        reason: result.rejectedReason,
        attemptedValue: result.attempted,
        acceptedValue: result.accepted,
      });
    }

    this.setValueFromUser(result.accepted);
    this.syncNativeInputValue();
    this.setCaretIndex(this.value.length);
  }

  private syncNativeInputValue(): void {
    const input = this.otpInput?.nativeElement;
    if (input && input.value !== this.value) {
      input.value = this.value;
    }
  }

  private setCaretIndex(nextIndex: number): void {
    const input = this.otpInput?.nativeElement;
    const maxIndex = this.value.length;
    const clamped = Math.min(Math.max(0, nextIndex), maxIndex);
    this.caretIndex = clamped;

    if (input) {
      try {
        input.setSelectionRange(clamped, clamped);
      } catch {
        // Ignore selection errors for unsupported input types.
      }
    }
    this.cdr.markForCheck();
  }
}
