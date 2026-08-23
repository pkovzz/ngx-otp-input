# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project follows [Semantic Versioning](https://semver.org/).

## 3.0.0

### Breaking

- Raised the peer dependency floor to Angular `19`. All component inputs are now signal inputs and all outputs are `output()` refs, so inputs can no longer be assigned imperatively on a component instance.
- A value written by a form that does not survive sanitization is now written back to the form, so the form model never holds a value the control rejects.

### Added

- [(#44)](https://github.com/pkovzz/ngx-otp-input/issues/44) Added signal forms support. `NgxOtpInputComponent` implements the `FormValueControl<string>` contract and can be bound with `[formField]` on Angular 22+.
- Added a `value` model input, so the component can be used without any forms through `[(value)]`.
- Added `disabled`, `readonly`, `required`, `invalid`, `touched`, and `name` inputs, and a `touch` output, which are kept in sync automatically by a bound signal form field.
- Added a public `focus(options?)` method.

### Changed

- Upgraded the workspace (library, demo and CI) to Angular 22 and TypeScript 6.
- Rewrote the component on signals: signal inputs/outputs, computed view state, and a single reconcile effect in place of `ngOnChanges` and `ChangeDetectorRef`.
- Replaced the legacy `.eslintrc.json` setup with a flat `eslint.config.js`, as angular-eslint 22 no longer ships eslintrc presets.
- Converted the demo application to signals so it renders correctly under Angular 22's OnPush-by-default change detection.
- Dropped the `CommonModule` import from the component; the template uses built-in control flow only.

## 2.0.0

### Breaking

- Redesigned the component around ControlValueAccessor (CVA). The old `otp` / `otpChange` model and the `options` object were removed.
- Switched to a single native input with visual boxes for better mobile SMS autofill and paste reliability.
- Replaced status handling with `status: 'idle' | 'success' | 'error'` and `statusMessages` (`error` replaces `failed`).

### Added

- Added `(otpChange)`, `(otpComplete)`, and `(otpInvalid)` outputs for value lifecycle events.
- Added `charPattern` input to control per-character allowlist behavior.
- Preserved boxed UI while improving accessibility and keyboard support.
- Rewrote project documentation with a full usage manual in both root and package README files.
- Added a documentation archive under `docs/`, including a preserved `v1.1.4` README snapshot.

### Changed

- Added `autocomplete="one-time-code"` for improved OTP autofill behavior.
- Modernized internal component state handling with Angular signals while preserving CVA behavior and the public API.
- Raised library peer dependency floor to Angular `17.2` and added `@angular/forms` as an explicit peer dependency.
- Expanded GitHub Actions to validate both library and demo release artifacts in CI and before npm publish.
- Added a release guard that validates GitHub release tags against `projects/ngx-otp-input/package.json` version.
- Added `build:demo` and `build:release` scripts to standardize release builds.

### Fixed

- Restored arrow key navigation between OTP boxes.
- Improved grammar, wording, and consistency in project documentation.

### Removed

- Removed per-box directives and the internal multi-input `FormArray` implementation.

## 1.1.4

### Fixed

- [(#35)](https://github.com/pkovzz/ngx-otp-input/issues/35) Fixed iOS quick bar paste behavior.

## 1.1.3

### Fixed

- [(#31)](https://github.com/pkovzz/ngx-otp-input/issues/31) Prevented errors when pasting more characters than available input boxes.

## 1.1.2

### Fixed

- [(#29)](https://github.com/pkovzz/ngx-otp-input/issues/29) Paste now fires only one `otpChange` and one `otpComplete` event.

## 1.1.1

### Fixed

- [(#27)](https://github.com/pkovzz/ngx-otp-input/issues/27) Fixed Android input events.

## 1.1.0

### Added

- Added the `inputMode` configuration option.

## 1.0.0

### Changed

- Migrated the library to a standalone component API with multiple breaking changes. See the [documentation](README.md) for details.

## 0.11.4

### Fixed

- Fixed [module import issue](https://github.com/pkovzz/ngx-otp-input/issues/16) and applied additional minor improvements.

## 0.11.1

### Fixed

- Fixed [Windows copy/paste issue](https://github.com/k2peter/ngx-otp-input/issues/11).

## 0.11.0

### Added

- Core refactor.
- Behavior options.

## 0.9.1

### Fixed

- Fixed `[disabled]` input property behavior.

## 0.9.0

### Added

- Added `autoblur` configuration option.

## 0.8.0

### Added

- Added `clear` method.

## 0.7.0

### Added

- Added `numericInputMode` configuration property.

## 0.6.6

### Fixed

- Fixed missing inputs issue.

## 0.6.3

### Fixed

- Fixed `ngClass` error when no custom class was set.

## 0.6.2

### Fixed

- Applied a workaround for: https://github.com/angular/angular/issues/38391

## 0.6.1

### Fixed

- Prevented lost input when typing very quickly.
- Ensured custom ["filled"](https://github.com/pkovzz/ngx-otp-input#inputfilled) style is applied to every input after paste.
