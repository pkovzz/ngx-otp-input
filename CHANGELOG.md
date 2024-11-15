# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.1.2

### Fixed

- [(#28)](https://github.com/pkovzz/ngx-otp-input/issues/29) Paste will fire only one _otpChange_ and one _otpComplete_ event

## 1.1.1

### Fixed

- [(#27)](https://github.com/pkovzz/ngx-otp-input/issues/27) Android input events

## 1.1.0

### Added

- Add `inputMode` configuration option.

## 1.0.0

- Library is now a standalone component and introduced a new API with several breaking changes. Plese check the [Documentation](../README.md) for more information.

## 0.11.4

### Fixed

- Bugfix of [module import issue](https://github.com/pkovzz/ngx-otp-input/issues/16) and other improvements

## 0.11.1

### Fixed

- Bugfix of [Windows copy paste issue](https://github.com/k2peter/ngx-otp-input/issues/11)

## 0.11.0

### Added

- Core refactor
- behavior options

## 0.9.1

### Fixed

- `[disabled]` input property

## 0.9.0

### Added

- `autoblur` configuration option.  
  For more information, please see the documentation.

## 0.8.0

### Added

- `clear` method.  
  For more information, please see the documentation.

## 0.7.0

### Added

- `numericInputMode` config property.  
  For more information, please see the documentation.

## 0.6.6

### Fixed

- missed inputs

## 0.6.3

### Fixed

- ngClass error when no custom class is set

## 0.6.2

### Fixed

- Applying workaround regard to this: https://github.com/angular/angular/issues/38391

## 0.6.1

### Fixed

- Preventing too fast typing, which could cause unregistered inputs
- The custom ["filled"](https://github.com/pkovzz/ngx-otp-input#inputfilled)
  style is now applied on every input after _paste_ event
