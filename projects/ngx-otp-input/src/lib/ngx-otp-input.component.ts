import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  effect,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
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

/**
 * OTP input control.
 *
 * Works with reactive and template-driven forms through `ControlValueAccessor`,
 * with signal forms through the `FormValueControl` contract (`value` model plus
 * the optional state inputs below), and standalone through `[(value)]`.
 */
@Component({
  standalone: true,
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
  implements ControlValueAccessor, AfterViewInit
{
  private readonly otpInput =
    viewChild<ElementRef<HTMLInputElement>>('otpInput');

  private readonly caretIndexState = signal<number | null>(null);
  private readonly cvaDisabled = signal(false);
  private readonly hasInvalidOtpState = signal(false);
  readonly statusMessageId = `ngx-otp-input-status-${nextStatusId++}`;

  private readonly sanitizer = new OtpSanitizer();
  private readonly caretManager = new CaretManager();
  private readonly keyHandlers: KeyHandler[] = createDefaultKeyHandlers();
  private readonly pasteDedupeWindowMs = 120;
  private pasteHandledAt = 0;

  // ---------------------------------------------------------------------------
  // Inputs
  // ---------------------------------------------------------------------------

  /**
   * The current code. Two-way bindable via `[(value)]`, and the field value a
   * bound signal form reads and writes.
   */
  readonly value = model('');

  readonly length = input(defaultV2.length, { transform: numberAttribute });
  readonly autoFocus = input(defaultV2.autoFocus, {
    transform: booleanAttribute,
  });
  readonly autoBlur = input(defaultV2.autoBlur, {
    transform: booleanAttribute,
  });
  readonly mask = input(defaultV2.mask, { transform: booleanAttribute });
  readonly charPattern = input(defaultV2.charPattern);
  readonly inputMode = input(defaultV2.inputMode);
  readonly ariaLabel = input(defaultV2.ariaLabel);
  readonly status = input<OtpStatus>('idle');
  readonly statusMessages = input<OtpStatusMessages>(defaultV2.statusMessages);

  // --- Optional parts of the signal forms `FormUiControl` contract. Signal
  // --- forms keeps these in sync with the bound field; they can also be set by
  // --- hand when the component is used outside of a form.

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly touched = input(false, { transform: booleanAttribute });
  readonly name = input<string>('one-time-code');

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  readonly otpChange = output<OtpChangeEvent>();
  readonly otpComplete = output<string>();
  readonly otpInvalid = output<OtpInvalidEvent>();
  /** Emitted on blur. Signal forms listens to this to mark the field touched. */
  readonly touch = output<void>();

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  readonly hasInvalidOtp = this.hasInvalidOtpState.asReadonly();

  /** Editing is blocked while disabled or readonly. */
  private readonly isLocked = computed(
    () => this.isDisabled() || this.readonly(),
  );

  readonly resolvedLength = computed(() => {
    const length = this.length();
    return Number.isFinite(length)
      ? Math.max(1, Math.floor(length))
      : defaultV2.length;
  });

  /**
   * An explicit `status` always wins; otherwise a bound signal form field that
   * is invalid and already touched renders as an error.
   */
  readonly resolvedStatus = computed<OtpStatus>(() => {
    const explicit = this.status();
    if (explicit !== 'idle') {
      return explicit;
    }
    return this.invalid() && this.touched() ? 'error' : 'idle';
  });

  readonly inputType = computed(() => (this.mask() ? 'password' : 'text'));

  readonly statusMessage = computed(() => {
    const messages = this.statusMessages();
    const byStatus: Record<OtpStatus, string> = {
      success: messages?.success ?? defaultV2.statusMessages.success,
      error: messages?.error ?? defaultV2.statusMessages.error,
      idle: '',
    };
    return byStatus[this.resolvedStatus()] ?? '';
  });

  readonly isComplete = computed(
    () => this.value().length === this.resolvedLength(),
  );

  readonly characters = computed(() => {
    const chars = this.value().split('');
    return Array.from(
      { length: this.resolvedLength() },
      (_, index) => chars[index] ?? '',
    );
  });

  readonly displayCharacters = computed(() =>
    this.characters().map((char) => (this.mask() && char ? '•' : char)),
  );

  readonly activeIndex = computed(() => {
    const caretIndex = this.caretIndexState() ?? this.value().length;
    return Math.min(
      Math.max(0, caretIndex),
      Math.max(0, this.resolvedLength() - 1),
    );
  });

  readonly boxes = computed(() =>
    Array.from({ length: this.resolvedLength() }, (_, index) => index),
  );

  readonly patternAttribute = computed(() => {
    const source = this.charPattern()?.source ?? '';
    if (!source) {
      return null;
    }
    const unanchored = source.replace(/^\^/, '').replace(/\$$/, '');
    return `(?:${unanchored}){0,${this.resolvedLength()}}`;
  });

  constructor() {
    // Reconciles the value with the current length/charPattern and mirrors it
    // onto the native input. This covers every write the component does not
    // originate itself: `writeValue`, `[(value)]`, a signal form field, and a
    // change to `length` or `charPattern` that shortens the accepted value.
    effect(() => {
      const raw = this.value();
      const accepted = this.sanitize(raw).accepted;

      if (accepted !== raw) {
        this.value.set(accepted);
        this.onChange(accepted);
        return;
      }

      // The view query is read tracked, so the effect runs again if the native
      // input is ever swapped out. Only the imperative DOM work is untracked.
      const input = this.otpInput()?.nativeElement;
      untracked(() => {
        if (input && input.value !== accepted) {
          this.caretManager.syncNativeValue(input, accepted);
          this.setCaretIndex(accepted.length);
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Lifecycle hooks
  // ---------------------------------------------------------------------------

  ngAfterViewInit(): void {
    if (this.autoFocus() && !this.isDisabled()) {
      queueMicrotask(() => this.focus());
    }
  }

  // ---------------------------------------------------------------------------
  // ControlValueAccessor
  // ---------------------------------------------------------------------------

  writeValue(value: string | null): void {
    this.hasInvalidOtpState.set(false);
    // Sanitizing and mirroring onto the native input is left to the reconcile
    // effect so that every external write goes through one code path.
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /** Focuses the control. Also used by signal forms to focus the field. */
  focus(options?: FocusOptions): void {
    this.otpInput()?.nativeElement.focus(options);
  }

  /** Clears the code and moves the caret back to the first box. */
  reset(): void {
    this.hasInvalidOtpState.set(false);
    this.setValueFromUser('');
    this.syncNativeInputValue();
    this.setCaretIndex(0);
  }

  // ---------------------------------------------------------------------------
  // Event handlers (template-bound)
  // ---------------------------------------------------------------------------

  handleContainerPointerDown(event: PointerEvent): void {
    if (this.isDisabled()) {
      return;
    }

    this.focus();

    if (event.pointerType === 'mouse') {
      event.preventDefault();
      queueMicrotask(() => this.setCaretIndex(this.value().length));
    }
  }

  handleBoxPointerDown(event: PointerEvent, index: number): void {
    if (this.isDisabled()) {
      return;
    }
    if (event.pointerType !== 'mouse') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.focus();
    const nextIndex = Math.min(index, this.value().length);
    this.setCaretIndex(nextIndex);
    queueMicrotask(() => this.setCaretIndex(nextIndex));
  }

  handleBeforeInput(event: InputEvent): void {
    if (this.isLocked()) {
      return;
    }

    if (!isPasteLikeInput(event)) {
      return;
    }

    if (this.wasPasteHandledRecently()) {
      event.preventDefault();
      return;
    }

    const insertedText =
      event.data ?? event.dataTransfer?.getData('text/plain') ?? '';
    if (!insertedText) {
      // iOS can omit payload in beforeinput/paste for security reasons.
      // Select all so native insertion replaces existing value.
      this.caretManager.selectAll(this.otpInput()?.nativeElement);
      return;
    }

    event.preventDefault();
    this.markPasteHandled();
    this.applyPastedValue(insertedText);
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.isLocked()) {
      this.syncNativeInputValue();
      return;
    }

    const result = this.sanitize(target.value ?? '');
    this.applySanitizedResult(
      result,
      () => target.selectionStart ?? this.value().length,
    );
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.isLocked()) {
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
    if (this.isLocked()) {
      return;
    }

    if (this.wasPasteHandledRecently()) {
      event.preventDefault();
      return;
    }

    const text = event.clipboardData?.getData('text') ?? '';
    if (!text) {
      // Some mobile browsers (notably iOS Safari paste callout) can dispatch
      // paste without exposing clipboardData; select all so native insertion
      // replaces current value.
      this.caretManager.selectAll(this.otpInput()?.nativeElement);
      return;
    }
    event.preventDefault();
    this.markPasteHandled();
    this.applyPastedValue(text);
  }

  handleBlur(): void {
    this.onTouched();
    this.touch.emit();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private sanitize(value: string): SanitizationResult {
    return this.sanitizer.sanitize(
      value,
      this.resolvedLength(),
      this.charPattern(),
    );
  }

  private setValueFromUser(nextValue: string): void {
    this.value.set(nextValue);
    this.onChange(nextValue);
    this.otpChange.emit({
      value: nextValue,
      isComplete: this.isComplete(),
    });

    if (this.isComplete()) {
      this.otpComplete.emit(nextValue);
      if (this.autoBlur()) {
        this.otpInput()?.nativeElement.blur();
      }
    }
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
    this.applySanitizedResult(result, () => this.value().length);
  }

  private markPasteHandled(): void {
    this.pasteHandledAt = performance.now();
  }

  private wasPasteHandledRecently(): boolean {
    if (this.pasteHandledAt === 0) {
      return false;
    }

    if (performance.now() - this.pasteHandledAt < this.pasteDedupeWindowMs) {
      return true;
    }

    this.pasteHandledAt = 0;
    return false;
  }

  private syncNativeInputValue(): void {
    this.caretManager.syncNativeValue(
      this.otpInput()?.nativeElement,
      this.value(),
    );
  }

  private setCaretIndex(nextIndex: number): void {
    const clamped = this.caretManager.setCaretPosition(
      this.otpInput()?.nativeElement,
      nextIndex,
      this.value().length,
    );
    this.caretIndexState.set(clamped);
  }

  private buildKeyHandlerContext(): KeyHandlerContext {
    const input = this.otpInput()?.nativeElement;
    const value = this.value();
    const selectionStart = input?.selectionStart ?? value.length;
    const selectionEnd = input?.selectionEnd ?? selectionStart;

    return {
      value,
      resolvedLength: this.resolvedLength(),
      selectionStart,
      selectionEnd,
      isCharAllowed: (ch: string) =>
        this.sanitizer.isCharAllowed(ch, this.charPattern()),
      sanitize: (nextValue: string) => this.sanitize(nextValue),
      applySanitizedResult: (result, caretResolver) =>
        this.applySanitizedResult(result, caretResolver),
      setValueFromUser: (nextValue: string) => this.setValueFromUser(nextValue),
      syncNativeInputValue: () => this.syncNativeInputValue(),
      setCaretIndex: (index: number) => this.setCaretIndex(index),
      setInvalidState: (reason, attemptedValue) => {
        this.hasInvalidOtpState.set(true);
        this.otpInvalid.emit({
          reason,
          attemptedValue,
          acceptedValue: this.value(),
        });
      },
    };
  }
}
