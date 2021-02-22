export interface NgxOtpInputConfig {
  otpLength: number;
  pattern?: RegExp;
  autofocus?: boolean;
  isPasswordInput?: boolean;
  ariaLabels?: string | string[];
  classList?: {
    container?: string;
    inputBox?: string;
    input?: string;
    inputFilled?: string;
    inputDisabled?: string;
  };
}
