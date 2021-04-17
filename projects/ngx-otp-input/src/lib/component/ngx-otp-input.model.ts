export type NgxOtpStatus = 'success' | 'error' | null;

export interface NgxOtpInputConfig {
  otpLength: number;
  pattern?: RegExp;
  autofocus?: boolean;
  isPasswordInput?: boolean;
  ariaLabels?: string | string[];
  numericInputMode?: boolean;
  classList?: {
    container?: string | string[];
    inputBox?: string | string[];
    input?: string | string[];
    inputFilled?: string | string[];
    inputDisabled?: string | string[];
    inputSuccess?: string | string[];
    inputError?: string | string[];
  };
}
