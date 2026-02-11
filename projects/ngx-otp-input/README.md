# ngx-otp-input

[![License](https://img.shields.io/github/license/pkovzz/ngx-otp-input?style=flat)](../../LICENSE)

`ngx-otp-input` is a standalone, CVA-first Angular component for One-Time Password (OTP) entry.
It combines:

- robust mobile input behavior (`autocomplete="one-time-code"`, paste handling)
- polished boxed UI
- Angular Forms integration
- accessibility defaults (labels, invalid state, live status announcements)

## Compatibility

- Angular `>=17.2.0`
- `@angular/forms` is required

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

### Outputs

| Output        | Type                            | Description                                                                       |
| ------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| `otpChange`   | `EventEmitter<OtpChangeEvent>`  | Emitted on every valid change with `{ value, isComplete }`.                       |
| `otpComplete` | `EventEmitter<string>`          | Emitted once the value reaches `length`.                                          |
| `otpInvalid`  | `EventEmitter<OtpInvalidEvent>` | Emitted when characters are rejected (`char-rejected`) or truncated (`too-long`). |

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

### Public method

`NgxOtpInputComponent` exposes:

- `reset(): void`

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

## Migration (v1 to v2)

Version `2.x` is a breaking release:

- Removed the old `options` object API.
- Removed direct `otp` input binding.
- Moved to explicit inputs and ControlValueAccessor-based forms usage.
- Updated event payloads and status values.

## Links

- Demo: http://ngx-otp-input.vercel.app
- Changelog: https://github.com/pkovzz/ngx-otp-input/blob/master/CHANGELOG.md
- Contributing: https://github.com/pkovzz/ngx-otp-input/blob/master/CONTRIBUTING.md
- Code of conduct: https://github.com/pkovzz/ngx-otp-input/blob/master/CODE_OF_CONDUCT.md
- License: https://github.com/pkovzz/ngx-otp-input/blob/master/LICENSE
