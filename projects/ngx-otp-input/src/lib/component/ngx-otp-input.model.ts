export type NgxOtpStatus = 'success' | 'error' | null;

export enum NgxOtpBehavior {
  DEFAULT,
  LEGACY,
}

export type NgxOtpStyles = {
  container?: string | string[];
  inputBox?: string | string[];
  input?: string | string[];
  inputFilled?: string | string[];
  inputDisabled?: string | string[];
  inputSuccess?: string | string[];
  inputError?: string | string[];
};

export interface NgxOtpInputConfig {
  otpLength: number;
  pattern?: RegExp;
  autofocus?: boolean;
  autoblur?: boolean;
  isPasswordInput?: boolean;
  ariaLabels?: string | string[];
  numericInputMode?: boolean;
  classList?: NgxOtpStyles;
  behavior?: NgxOtpBehavior;
}
