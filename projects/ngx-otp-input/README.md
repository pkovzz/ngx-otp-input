# ngx-otp-input

[![License](https://img.shields.io/github/license/pkovzz/ngx-otp-input?style=flat)](../../LICENSE)

`ngx-otp-input` is a standalone, signal-based Angular component for One-Time Password (OTP) entry.
It combines:

- robust mobile input behavior (`autocomplete="one-time-code"`, paste handling)
- polished boxed UI
- Angular Forms integration: reactive, template-driven, and signal forms
- accessibility defaults (labels, invalid state, live status announcements)

## Compatibility

- Angular `>=19.0.0`
- `@angular/forms` is required
- Angular `>=22.0.0` for the signal forms integration

## Installation

```bash
npm install ngx-otp-input
```

## Basic usage (Reactive Forms)

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
        (otpComplete)="onOtpComplete($event)"
      ></ngx-otp-input>
    </form>
  `,
})
export class AppComponent {
  status: OtpStatus = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  onOtpComplete(code: string): void {
    // verify code and update this.status
  }
}
```

## Signal Forms usage (Angular 22+)

The component implements the signal forms `FormValueControl<string>` contract,
so binding a field with the `FormField` directive is all that is required.

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
      (otpComplete)="onOtpComplete($event)"
    ></ngx-otp-input>
  `,
})
export class AppComponent {
  readonly model = signal({ otp: '' });

  readonly loginForm = form(this.model, (path) => {
    required(path.otp);
    minLength(path.otp, 6);
  });

  onOtpComplete(code: string): void {
    // verify code
  }
}
```

`value`, `disabled`, `readonly`, `required`, `invalid`, `touched`, and `name`
are kept in sync with the bound field. Blur marks the field touched, and a
field that is both `invalid` and `touched` renders the error state unless an
explicit `status` overrides it.

## Usage without forms

The `value` model input works on its own, with no forms module involved.

```typescript
import { Component, signal } from '@angular/core';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxOtpInputComponent],
  template: `<ngx-otp-input [(value)]="code" />`,
})
export class AppComponent {
  readonly code = signal('');
}
```

## Advanced usage example

```html
<ngx-otp-input
  formControlName="otp"
  [length]="8"
  [autoFocus]="true"
  [autoBlur]="false"
  [mask]="true"
  [charPattern]="/^[A-Za-z0-9]$/"
  inputMode="text"
  ariaLabel="Enter your 8-character verification code"
  [status]="status"
  [statusMessages]="{
    success: 'Verification successful.',
    error: 'Verification failed. Please try again.'
  }"
  (otpChange)="onOtpChange($event)"
  (otpInvalid)="onOtpInvalid($event)"
></ngx-otp-input>
```

## API

### Inputs

| Input            | Type                | Default                                                 | Description                                                                    |
| ---------------- | ------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `length`         | `number`            | `6`                                                     | Number of OTP characters / visual boxes. Minimum effective value is `1`.       |
| `autoFocus`      | `boolean`           | `true`                                                  | Automatically focuses the input after view init (if enabled and not disabled). |
| `autoBlur`       | `boolean`           | `true`                                                  | Blurs the input when all characters are entered.                               |
| `mask`           | `boolean`           | `false`                                                 | Displays `•` in the visual boxes while preserving the actual value.            |
| `charPattern`    | `RegExp`            | `/^\d$/`                                                | Validates each character individually.                                         |
| `inputMode`      | `string`            | `'numeric'`                                             | Keyboard hint for touch devices (`numeric`, `text`, etc.).                     |
| `ariaLabel`      | `string`            | `'One Time Password'`                                   | Accessible label for the input group.                                          |
| `status`         | `OtpStatus`         | `'idle'`                                                | Status state: `'idle' \| 'success' \| 'error'`.                                |
| `statusMessages` | `OtpStatusMessages` | `{ success: 'Code verified.', error: 'Invalid code.' }` | Custom text announced in the live region for success/error states.             |
| `value`          | `string`            | `''`                                                    | The current code. Two-way bindable via `[(value)]`.                            |
| `disabled`       | `boolean`           | `false`                                                 | Disables the control. Also set by forms.                                       |
| `readonly`       | `boolean`           | `false`                                                 | Renders the value but rejects edits.                                           |
| `required`       | `boolean`           | `false`                                                 | Sets `aria-required` on the native input.                                      |
| `invalid`        | `boolean`           | `false`                                                 | Marks the value invalid; shows the error state once touched.                   |
| `touched`        | `boolean`           | `false`                                                 | Whether the control has been blurred at least once.                            |
| `name`           | `string`            | `'one-time-code'`                                       | `name` attribute of the native input.                                          |

### Outputs

| Output        | Type                         | Description                                                                       |
| ------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| `otpChange`   | `OutputRef<OtpChangeEvent>`  | Emitted on every valid change with `{ value, isComplete }`.                       |
| `otpComplete` | `OutputRef<string>`          | Emitted once the value reaches `length`.                                          |
| `otpInvalid`  | `OutputRef<OtpInvalidEvent>` | Emitted when characters are rejected (`char-rejected`) or truncated (`too-long`). |
| `valueChange` | `OutputRef<string>`          | Emitted on every value change (the `[(value)]` half).                             |
| `touch`       | `OutputRef<void>`            | Emitted on blur. Signal forms uses it to mark the field touched.                  |

### Exported types

```typescript
type OtpStatus = 'idle' | 'success' | 'error';

interface OtpStatusMessages {
  success?: string;
  error?: string;
}

interface OtpChangeEvent {
  value: string;
  isComplete: boolean;
}

interface OtpInvalidEvent {
  reason: 'too-long' | 'char-rejected';
  attemptedValue: string;
  acceptedValue: string;
}
```

### Public methods

`NgxOtpInputComponent` exposes:

- `reset(): void`
- `focus(options?: FocusOptions): void`

```typescript
import { Component, ViewChild } from '@angular/core';
import { NgxOtpInputComponent } from 'ngx-otp-input';

export class AppComponent {
  @ViewChild(NgxOtpInputComponent) otpInput?: NgxOtpInputComponent;

  clearOtp(): void {
    this.otpInput?.reset();
  }
}
```

## Styling

The component exposes stable class names for custom theming:

- `ngx-otp-input-root`
- `ngx-otp-input-native`
- `ngx-otp-input-form`
- `ngx-otp-input-box`
- `ngx-otp-input-active`
- `ngx-otp-input-disabled`
- `ngx-otp-input-filled`
- `ngx-otp-input-success`
- `ngx-otp-input-failed`
- `ngx-otp-input-status`

Example:

```scss
ngx-otp-input {
  .ngx-otp-input-box {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.75rem;
  }

  .ngx-otp-input-box.ngx-otp-input-active {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgb(99 102 241 / 20%);
  }
}
```

## Accessibility notes

- Uses one native input for predictable assistive technology behavior.
- Sets `aria-invalid` when status is `error` or invalid input is detected.
- Announces status messages through a polite `aria-live` region.
- Keeps visual OTP boxes hidden from screen readers to avoid duplicate output.

## Behavior details

- Input is sanitized on typing and paste.
- Values longer than `length` are truncated.
- Characters not matching `charPattern` are ignored.
- Arrow keys, backspace, and delete are supported for keyboard editing.

## Migration (v2 to v3)

Version `3.x` moves the component to Angular signal APIs:

- The peer dependency floor is now Angular `19`.
- All inputs are signal inputs and all outputs are `output()` refs. Template
  usage is unchanged, but code that assigned inputs imperatively on a component
  instance (for example `otpInput.length = 8`) must bind them in a template or
  use `componentRef.setInput` instead.
- Added the signal forms `FormValueControl<string>` contract (Angular 22+).
- A value written by a form that does not survive sanitization is now written
  back to the form.

## Migration (v1 to v2)

Version `2.x` is a breaking release:

- Removed the old `options` object API.
- Removed direct `otp` input binding.
- Moved to explicit inputs and ControlValueAccessor-based forms usage.
- Updated event payloads and status values.

## Links

- Demo: https://ngx-otp-input.vercel.app
- Changelog: https://github.com/pkovzz/ngx-otp-input/blob/master/CHANGELOG.md
- Contributing: https://github.com/pkovzz/ngx-otp-input/blob/master/CONTRIBUTING.md
- Code of conduct: https://github.com/pkovzz/ngx-otp-input/blob/master/CODE_OF_CONDUCT.md
- License: https://github.com/pkovzz/ngx-otp-input/blob/master/LICENSE
