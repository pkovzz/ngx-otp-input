# ngx-otp-input

[![License](https://img.shields.io/github/license/pkovzz/ngx-otp-input?style=flat)](/../../LICENSE.txt)

:warning: **Important note:** starting with version 2.0.0, the library is CVA-first (Angular forms) and introduces breaking API changes. Please review the usage examples and migration notes below.

## What is this?

A lightweight Angular OTP (One Time Password) input with a boxed UI, strong mobile UX (SMS autofill / paste), and accessible defaults.

### Demo page

http://ngx-otp-input.vercel.app

## Requirements

Angular **17.2** or above.

## Installation

```bash
npm install ngx-otp-input --save
```

## Example usage (Reactive Forms)

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent } from 'ngx-otp-input';

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
        (otpComplete)="verify($event)"
      ></ngx-otp-input>
    </form>
  `,
})
export class AppComponent {
  status: 'idle' | 'success' | 'error' = 'idle';

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  verify(value: string) {
    // call API, then set status
  }
}
```

## Inputs

| Input            | Type                                   | Default             | Notes                                    |
| ---------------- | -------------------------------------- | ------------------- | ---------------------------------------- | ------ | ----------------------------- |
| `length`         | number                                 | 6                   | Number of boxes / expected OTP length    |
| `autoFocus`      | boolean                                | true                | Focus the input on init                  |
| `autoBlur`       | boolean                                | true                | Blur after completion                    |
| `mask`           | boolean                                | false               | Render masked characters (password-like) |
| `charPattern`    | RegExp                                 | `/^\\d$/`           | Per-character allowlist                  |
| `inputMode`      | string                                 | `numeric`           | Mobile keyboard hint                     |
| `ariaLabel`      | string                                 | `One Time Password` | Accessible label for the group           |
| `status`         | `'idle' \\                             | 'success' \\        | 'error'`                                 | `idle` | Visual + screen reader status |
| `statusMessages` | `{ success?: string; error?: string }` | see defaults        | Screen reader messages                   |

## Outputs

| Output        | Payload                                  | Description                                                       |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| `otpChange`   | `{ value: string; isComplete: boolean }` | Emitted when value changes                                        |
| `otpComplete` | `string`                                 | Emitted when OTP reaches full length                              |
| `otpInvalid`  | `{ reason: 'too-long' \\                 | 'char-rejected'; attemptedValue: string; acceptedValue: string }` | Emitted when input is rejected during sanitize |

## Styling

The library provides a set of CSS classes that you can use to style the OTP form. The following classes are available:

| Class name               | Description                |
| ------------------------ | -------------------------- |
| `ngx-otp-input-root`     | The root container         |
| `ngx-otp-input-form`     | The visual boxes container |
| `ngx-otp-input-box`      | The visual box             |
| `ngx-otp-input-active`   | The active box             |
| `ngx-otp-input-disabled` | The disabled state         |
| `ngx-otp-input-filled`   | The filled state of a box  |
| `ngx-otp-input-success`  | The success state          |
| `ngx-otp-input-failed`   | The error state            |

### How to use the classes

Styling is quite simple, but you have to use the classes directly in a **root** style file:

```scss
ngx-otp-input {
  .ngx-otp-input-form {
    ...
  }
  .ngx-otp-input-box {
    ...
  }
}
```

## Reset the control

```html
<form [formGroup]="form">
  <ngx-otp-input
    #otpInput
    formControlName="otp"
  ></ngx-otp-input>
</form>
```

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
  `,
})
export class AppComponent {
  @ViewChild('otpInput') otpInput: NgxOtpInputComponent;

  form = new FormGroup({
    otp: new FormControl('', { nonNullable: true }),
  });

  resetForm() {
    this.otpInput.reset();
  }
}
```

## Accessibility notes

- The component renders a single native input for screen readers and an `aria-live` region for status announcements.
- `ariaLabel` controls the accessible name for the group.
- Visual boxes are `aria-hidden` to avoid duplicate announcements.

## Input mode and charPattern

`inputMode` hints the mobile keyboard, while `charPattern` restricts allowed characters per digit. Use both together for the best mobile OTP experience.

## Masked input

Set `mask` to `true` to hide the characters (password-style). Some password managers may overlay icons on inputs.

## Migration notes (v1 → v2)

- `options` object was removed. Use explicit inputs like `[length]`, `[mask]`, `[charPattern]`.
- `otp` input was removed. Use **Reactive Forms** (`formControlName`) to read/write values.
- `otpChange` payload changed from `string[]` to `{ value: string; isComplete: boolean }`.
- `otpInvalid` payload changed to `{ reason; attemptedValue; acceptedValue }`.
- `status` values changed to `'idle' | 'success' | 'error'`.

## Contributing

If you would like to contribute to this project, please refer to the [CONTRIBUTING](https://github.com/pkovzz/ngx-otp-input/blob/master/CONTRIBUTING.md) file for more information.

## Code of Conduct

Please read the [CODE_OF_CONDUCT](https://github.com/pkovzz/ngx-otp-input/blob/master/CODE_OF_CONDUCT.md) file for more information.

## Changelog

See the [CHANGELOG](https://github.com/pkovzz/ngx-otp-input/blob/master/CHANGELOG.md) file for details.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/pkovzz/ngx-otp-input/blob/master/LICENSE) file for details.
