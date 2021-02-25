export interface NgxOtpInputConfig {
  otpLength: number;
  pattern?: RegExp;
  autofocus?: boolean;
  isPasswordInput?: boolean;
  ariaLabels?: string | string[];
  classList?: {
    container?: string | string[];
    inputBox?: string | string[];
    input?: string | string[];
    inputFilled?: string | string[];
    inputDisabled?: string | string[];
  };
}
