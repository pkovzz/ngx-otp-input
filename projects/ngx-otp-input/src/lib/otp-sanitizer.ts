import { OtpInvalidEvent } from './default.config';

export interface SanitizationResult {
  attempted: string;
  accepted: string;
  rejectedReason?: OtpInvalidEvent['reason'];
}

export class OtpSanitizer {
  sanitize(
    value: string,
    maxLength: number,
    charPattern: RegExp,
  ): SanitizationResult {
    const attempted = value ?? '';
    const chars = attempted.split('');
    let rejectedReason: OtpInvalidEvent['reason'] | undefined;

    const acceptedChars: string[] = [];
    for (const ch of chars) {
      if (acceptedChars.length >= maxLength) {
        rejectedReason = rejectedReason ?? 'too-long';
        continue;
      }
      if (!this.isCharAllowed(ch, charPattern)) {
        rejectedReason = rejectedReason ?? 'char-rejected';
        continue;
      }
      acceptedChars.push(ch);
    }

    return { attempted, accepted: acceptedChars.join(''), rejectedReason };
  }

  isCharAllowed(ch: string, charPattern: RegExp): boolean {
    const isValid = charPattern.test(ch);
    if (charPattern.global || charPattern.sticky) {
      charPattern.lastIndex = 0;
    }
    return isValid;
  }
}
