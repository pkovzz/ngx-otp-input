import { SanitizationResult } from '../otp-sanitizer';
import { OtpInvalidEvent } from '../default.config';

export interface KeyHandlerContext {
  readonly value: string;
  readonly resolvedLength: number;
  readonly selectionStart: number;
  readonly selectionEnd: number;
  isCharAllowed(ch: string): boolean;
  sanitize(value: string): SanitizationResult;
  applySanitizedResult(
    result: SanitizationResult,
    caretResolver: () => number,
  ): void;
  setValueFromUser(value: string): void;
  syncNativeInputValue(): void;
  setCaretIndex(index: number): void;
  setInvalidState(
    reason: OtpInvalidEvent['reason'],
    attemptedValue: string,
  ): void;
}

export interface KeyHandler {
  canHandle(event: KeyboardEvent): boolean;
  handle(event: KeyboardEvent, context: KeyHandlerContext): void;
}
