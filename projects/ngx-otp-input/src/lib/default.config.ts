import { NgxOtpInputComponentConfig } from './ngx-otp-input.component';

const DEFAULT_OTP_LENGTH = 6;

const defaultConfig: NgxOtpInputComponentConfig = {
  otpLength: DEFAULT_OTP_LENGTH,
  autoFocus: true,
  autoBlur: true,
  hideInputValues: false,
  regexp: /^[0-9]+$/,
  blinkingCursor: true,
  ariaLabels: [],
};

export default defaultConfig;
