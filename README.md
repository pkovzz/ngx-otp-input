# ngx-otp-input

[![License](https://img.shields.io/github/license/pkovzz/ngx-otp-input?style=flat)](./LICENSE)

`ngx-otp-input` is an Angular OTP component with a boxed UI, mobile-friendly behavior, and accessibility-focused defaults. It plugs into reactive forms, template-driven forms, signal forms, or plain two-way binding.

## Why this library

Building OTP inputs from scratch usually means solving many edge cases:

- paste and autofill behavior across browsers and mobile keyboards
- accessible announcements and clear focus handling
- validation, sanitization, and keyboard navigation
- a polished OTP box UI that still works with Angular Forms

This library handles those details and exposes a small, explicit API.

## Demo

- Live demo: http://ngx-otp-input.vercel.app

## Requirements

- Angular `>=19.0.0`
- `@angular/forms` (required peer dependency)
- Angular `>=22.0.0` for the signal forms integration

## Installation

```bash
npm install ngx-otp-input
```

## Quick start (Reactive Forms)

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent, OtpStatus } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgxOtpInputComponent],
  template: `
    <form [formGroup]="form">
      <ngx-otp-input
        formControlName="otp"
        [length]="6"
        [status]="status"
        (otpComplete)="verifyOtp($event)"
      ></ngx-otp-input>
    </form>
  `,
})
export class AppComponent {
  status: OtpStatus = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  verifyOtp(code: string): void {
    // Verify the code, then set status to 'success' or 'error'
  }
}
```

## Quick start (Signal Forms, Angular 22+)

`NgxOtpInputComponent` implements the signal forms `FormValueControl<string>`
contract, so it can be bound to a field with the `FormField` directive. No extra
adapter is needed.

```typescript
import { Component, signal } from '@angular/core';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormField, NgxOtpInputComponent],
  template: `
    <ngx-otp-input
      [formField]="loginForm.otp"
      [length]="6"
      (otpComplete)="verifyOtp($event)"
    ></ngx-otp-input>
  `,
})
export class AppComponent {
  readonly model = signal({ otp: '' });

  readonly loginForm = form(this.model, (path) => {
    required(path.otp);
    minLength(path.otp, 6);
  });

  verifyOtp(code: string): void {
    // Verify the code
  }
}
```

The field keeps these parts of the control contract in sync automatically:
`value`, `disabled`, `readonly`, `required`, `invalid`, `touched`, and `name`.
Blur marks the field touched, and a field that is both `invalid` and `touched`
renders the error state unless an explicit `status` overrides it.

## Quick start (no forms)

```html
<ngx-otp-input [(value)]="code" />
```

## API reference

### Inputs

| Input            | Type                                           | Default                                                 | Description                                                    |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| `length`         | `number`                                       | `6`                                                     | Number of OTP characters / visible boxes.                      |
| `autoFocus`      | `boolean`                                      | `true`                                                  | Focuses the input after view init (unless disabled).           |
| `autoBlur`       | `boolean`                                      | `true`                                                  | Blurs the input when the OTP becomes complete.                 |
| `mask`           | `boolean`                                      | `false`                                                 | Masks rendered characters (`•`) in the visual boxes.           |
| `charPattern`    | `RegExp`                                       | `/^\d$/`                                                | Per-character allowlist used during typing/paste sanitization. |
| `inputMode`      | `string`                                       | `'numeric'`                                             | Sets the native input's `inputmode` for mobile keyboard hints. |
| `ariaLabel`      | `string`                                       | `'One Time Password'`                                   | Accessible label for the OTP group.                            |
| `status`         | `OtpStatus` (`'idle' \| 'success' \| 'error'`) | `'idle'`                                                | Visual + screen reader status state.                           |
| `statusMessages` | `OtpStatusMessages`                            | `{ success: 'Code verified.', error: 'Invalid code.' }` | Custom screen reader status messages.                          |
| `value`          | `string`                                       | `''`                                                    | The current code. Two-way bindable via `[(value)]`.            |
| `disabled`       | `boolean`                                      | `false`                                                 | Disables the control. Also set by forms.                       |
| `readonly`       | `boolean`                                      | `false`                                                 | Renders the value but rejects edits.                           |
| `required`       | `boolean`                                      | `false`                                                 | Sets `aria-required` on the native input.                      |
| `invalid`        | `boolean`                                      | `false`                                                 | Marks the value invalid; shows the error state once touched.   |
| `touched`        | `boolean`                                      | `false`                                                 | Whether the control has been blurred at least once.            |
| `name`           | `string`                                       | `'one-time-code'`                                       | `name` attribute of the native input.                          |

`value`, `disabled`, `readonly`, `required`, `invalid`, `touched`, and `name`
form the signal forms `FormValueControl<string>` contract and are bound
automatically when the component is used with `[formField]`.

### Outputs

| Output        | Payload           | Description                                                    |
| ------------- | ----------------- | -------------------------------------------------------------- |
| `otpChange`   | `OtpChangeEvent`  | Fires whenever value changes (`{ value, isComplete }`).        |
| `otpComplete` | `string`          | Fires when value reaches `length`.                             |
| `otpInvalid`  | `OtpInvalidEvent` | Fires when input is rejected (`too-long` or `char-rejected`).  |
| `valueChange` | `string`          | Fires on every value change (the `[(value)]` half).            |
| `touch`       | `void`            | Fires on blur. Signal forms uses it to mark the field touched. |

Exported types:

- `OtpStatus`
- `OtpStatusMessages`
- `OtpChangeEvent`
- `OtpInvalidEvent`

### Public methods

`NgxOtpInputComponent` exposes:

- `reset(): void` - clears the current value and moves the caret to index `0`.
- `focus(options?: FocusOptions): void` - focuses the underlying native input.

Example:

```typescript
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgxOtpInputComponent],
  template: `
    <form [formGroup]="form">
      <ngx-otp-input
        #otpInput
        formControlName="otp"
      ></ngx-otp-input>
    </form>
    <button
      type="button"
      (click)="resetOtp()"
    >
      Reset
    </button>
  `,
})
export class AppComponent {
  @ViewChild('otpInput') otpInput?: NgxOtpInputComponent;

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  resetOtp(): void {
    this.otpInput?.reset();
  }
}
```

## Styling guide

The component renders a native input plus a visual boxed UI. These classes are available:

| Class                    | Description                                 |
| ------------------------ | ------------------------------------------- |
| `ngx-otp-input-root`     | Root wrapper (`role="group"`).              |
| `ngx-otp-input-native`   | Hidden-but-accessible native input element. |
| `ngx-otp-input-form`     | Visual boxes container.                     |
| `ngx-otp-input-box`      | Individual box.                             |
| `ngx-otp-input-active`   | Active box based on caret position.         |
| `ngx-otp-input-disabled` | Disabled visual state.                      |
| `ngx-otp-input-filled`   | Box has a character.                        |
| `ngx-otp-input-success`  | Success status style.                       |
| `ngx-otp-input-failed`   | Error status style (`status === 'error'`).  |
| `ngx-otp-input-status`   | Screen reader status message container.     |

Override styles from a global stylesheet (for example, `src/styles.css`):

```scss
ngx-otp-input {
  .ngx-otp-input-box {
    border-radius: 10px;
    font-weight: 600;
  }

  .ngx-otp-input-box.ngx-otp-input-active {
    outline: 2px solid #4f46e5;
  }
}
```

## Accessibility behavior

- Uses one real input for robust keyboard, paste, and autofill behavior.
- Uses `autocomplete="one-time-code"` to improve OTP autofill.
- Announces status messages with an `aria-live` region.
- Marks invalid state via `aria-invalid`.
- Keeps visual boxes `aria-hidden` to avoid duplicate announcements.

## Validation and sanitization behavior

- Input is truncated to `length`.
- Characters not matching `charPattern` are discarded.
- Rejected input emits `otpInvalid`.
- Valid changes emit `otpChange`; completion emits `otpComplete`.

## Migration notes (v2 -> v3)

Version `3.x` moves the component to Angular signal APIs:

- The peer dependency floor is now Angular `19`.
- All inputs are signal inputs and all outputs are `output()` refs. Template
  usage is unchanged, but code that assigned inputs imperatively on a component
  instance (for example `otpInput.length = 8`) must bind them in a template or
  use `componentRef.setInput` instead.
- Added `value`, `disabled`, `readonly`, `required`, `invalid`, `touched`, and
  `name` inputs plus the `touch` output, which together implement the signal
  forms `FormValueControl<string>` contract (Angular 22+).
- A value written by a form that does not survive sanitization is now written
  back to the form, so the form model never holds a value the control rejects.

## Migration notes (v1 -> v2)

Version `2.x` introduces a new CVA-first API:

- `options` input removed. Use explicit inputs like `[length]`, `[mask]`, and `[charPattern]`.
- direct `otp` input removed. Use Angular Forms (`formControl`, `formControlName`, or `ngModel`).
- `otpChange` payload changed from `string[]` to `{ value: string; isComplete: boolean }`.
- status values changed to `'idle' | 'success' | 'error'`.

## Repository docs

- Library package readme: `projects/ngx-otp-input/README.md`
- Documentation archive: `docs/README.md`
- Legacy `v1.1.4` docs: `docs/v1.1.4/README.md`
- Changelog: `CHANGELOG.md`
- Contributing guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`

## License

MIT. See `LICENSE`.
