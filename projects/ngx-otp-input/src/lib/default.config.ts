export type OtpStatus = 'idle' | 'success' | 'error';

export interface OtpStatusMessages {
  success?: string;
  error?: string;
}

export interface OtpInvalidEvent {
  reason: 'too-long' | 'char-rejected';
  attemptedValue: string;
  acceptedValue: string;
}

export interface OtpChangeEvent {
  value: string;
  isComplete: boolean;
}

export interface NgxOtpInputV2Defaults {
  length: number;
  autoFocus: boolean;
  autoBlur: boolean;
  mask: boolean;
  charPattern: RegExp;
  inputMode: string;
  ariaLabel: string;
  statusMessages: Required<OtpStatusMessages>;
}

export const defaultV2: NgxOtpInputV2Defaults = {
  length: 6,
  autoFocus: true,
  autoBlur: true,
  mask: false,
  charPattern: /^\d$/,
  inputMode: 'numeric',
  ariaLabel: 'One Time Password',
  statusMessages: {
    success: 'Code verified.',
    error: 'Invalid code.',
  },
};
