export interface NgxOtpInputComponentOptions {
  otpLength: number;
  autoFocus?: boolean;
  autoBlur?: boolean;
  hideInputValues?: boolean;
  regexp?: RegExp;
  showBlinkingCursor?: boolean;
  ariaLabels?: string[];
}

export const defaultOptions: NgxOtpInputComponentOptions = {
  otpLength: 6,
  autoFocus: true,
  autoBlur: true,
  hideInputValues: false,
  regexp: /^[0-9]+$/,
  showBlinkingCursor: false,
  ariaLabels: [],
};
