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
import { OtpSanitizer, SanitizationResult } from './otp-sanitizer';
import { CaretManager } from './caret-manager';
import {
  KeyHandler,
  KeyHandlerContext,
  createDefaultKeyHandlers,
} from './key-handlers';

let nextStatusId = 0;

function isPasteLikeInput(event: InputEvent): boolean {
  return (
    event.inputType === 'insertFromPaste' ||
    event.inputType === 'insertReplacementText'
  );
}

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

  private readonly sanitizer = new OtpSanitizer();
  private readonly caretManager = new CaretManager();
  private readonly keyHandlers: KeyHandler[] = createDefaultKeyHandlers();

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

  // ---------------------------------------------------------------------------
  // State accessors
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Template getters
  // ---------------------------------------------------------------------------

  get inputType(): string {
    return this.mask ? 'password' : 'text';
  }

  get statusMessage(): string {
    const messages: Record<OtpStatus, string> = {
      success: this.statusMessages?.success ?? defaultV2.statusMessages.success,
      error: this.statusMessages?.error ?? defaultV2.statusMessages.error,
      idle: '',
    };
    return messages[this.status] ?? '';
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

  // ---------------------------------------------------------------------------
  // Lifecycle hooks
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Event handlers (template-bound)
  // ---------------------------------------------------------------------------

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

    if (!isPasteLikeInput(event)) {
      return;
    }

    const insertedText =
      event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
    if (!insertedText) {
      // iOS can omit payload in beforeinput/paste for security reasons.
      // Select all so native insertion replaces existing value.
      this.caretManager.selectAll(this.otpInput?.nativeElement);
      return;
    }

    event.preventDefault();
    this.applyPastedValue(insertedText);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const result = this.sanitize(target.value ?? '');
    this.applySanitizedResult(
      result,
      () => target.selectionStart ?? this.value.length,
    );
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      return;
    }

    const context = this.buildKeyHandlerContext();

    for (const handler of this.keyHandlers) {
      if (handler.canHandle(event)) {
        handler.handle(event, context);
        return;
      }
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
      this.caretManager.selectAll(this.otpInput?.nativeElement);
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

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private sanitize(value: string): SanitizationResult {
    return this.sanitizer.sanitize(
      value,
      this.resolvedLength,
      this.charPattern,
    );
  }

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

  private applyInvalidState(result: SanitizationResult): void {
    this.hasInvalidOtpState.set(!!result.rejectedReason);
    if (result.rejectedReason) {
      this.otpInvalid.emit({
        reason: result.rejectedReason,
        attemptedValue: result.attempted,
        acceptedValue: result.accepted,
      });
    }
  }

  private applySanitizedResult(
    result: SanitizationResult,
    resolveCaretIndex: () => number,
  ): void {
    this.applyInvalidState(result);
    this.setValueFromUser(result.accepted);
    this.syncNativeInputValue();
    this.setCaretIndex(resolveCaretIndex());
  }

  private applyPastedValue(rawValue: string): void {
    const result = this.sanitize(rawValue);
    this.applySanitizedResult(result, () => this.value.length);
  }

  private syncNativeInputValue(): void {
    this.caretManager.syncNativeValue(this.otpInput?.nativeElement, this.value);
  }

  private setCaretIndex(nextIndex: number): void {
    const clamped = this.caretManager.setCaretPosition(
      this.otpInput?.nativeElement,
      nextIndex,
      this.value.length,
    );
    this.caretIndex = clamped;
    this.cdr.markForCheck();
  }

  private buildKeyHandlerContext(): KeyHandlerContext {
    const input = this.otpInput?.nativeElement;
    const selectionStart = input?.selectionStart ?? this.value.length;
    const selectionEnd = input?.selectionEnd ?? selectionStart;

    return {
      value: this.value,
      resolvedLength: this.resolvedLength,
      selectionStart,
      selectionEnd,
      isCharAllowed: (ch: string) =>
        this.sanitizer.isCharAllowed(ch, this.charPattern),
      sanitize: (value: string) => this.sanitize(value),
      applySanitizedResult: (result, caretResolver) =>
        this.applySanitizedResult(result, caretResolver),
      setValueFromUser: (value: string) => this.setValueFromUser(value),
      syncNativeInputValue: () => this.syncNativeInputValue(),
      setCaretIndex: (index: number) => this.setCaretIndex(index),
      setInvalidState: (reason, attemptedValue) => {
        this.hasInvalidOtpState.set(true);
        this.otpInvalid.emit({
          reason,
          attemptedValue,
          acceptedValue: this.value,
        });
        this.cdr.markForCheck();
      },
    };
  }
}
