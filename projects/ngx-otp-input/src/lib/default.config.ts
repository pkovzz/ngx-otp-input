export interface NgxOtpInputComponentConfig {
  otpLength: number;
  autoFocus?: boolean;
  autoBlur?: boolean;
  hideInputValues?: boolean;
  regexp?: RegExp;
  blinkingCursor?: boolean;
  ariaLabels?: string[];
}

export const defaultConfig: NgxOtpInputComponentConfig = {
  otpLength: 6,
  autoFocus: true,
  autoBlur: true,
  hideInputValues: false,
  regexp: /^[0-9]+$/,
  blinkingCursor: true,
  ariaLabels: [],
};
