# ngx-otp-input

[![License](https://img.shields.io/github/license/pkovzz/ngx-otp-input?style=flat)](/../../LICENSE.txt)

:warning: **Important note:** starting with version 2.0.0, the library has been redesigned around Angular forms best practices (ControlValueAccessor) and introduces breaking API changes. Please read the usage examples and migration notes below.

## What is this?

This is a simple Angular library that provides a **boxed OTP (One Time Password)** input with strong focus on mobile UX (SMS autofill / paste), accessibility, and Angular-idiomatic integration.

### Demo page

http://ngx-otp-input.vercel.app

## Requirements

To use this library, your project must be running **Angular 21** or above. This requirement stems from our adoption of standalone components, which are an integral feature in Angular's modern development approach. Standalone components offer a more streamlined and modular way to manage your components and simplify the dependency management, positioning them as the future of Angular development.

## Installation

To install this library, run:

```bash
npm install ngx-otp-input --save
```

## Example Usage (recommended: Reactive Forms)

The component implements **ControlValueAccessor**, so it works like a normal Angular form control.

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
        (complete)="verify($event)"
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

| Output     | Payload                                  | Description                                                       |
| ---------- | ---------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| `change`   | `{ value: string; isComplete: boolean }` | Emitted when value changes                                        |
| `complete` | `string`                                 | Emitted when OTP reaches full length                              |
| `invalid`  | `{ reason: 'too-long' \\                 | 'char-rejected'; attemptedValue: string; acceptedValue: string }` | Emitted when input is rejected during sanitize |

## Styling

The library provides a set of CSS classes that you can use to style the OTP form. The following classes are available:

| Class name               | Description                            |
| ------------------------ | -------------------------------------- |
| `ngx-otp-input-form`     | The main container of the OTP form     |
| `ngx-otp-input-box`      | The input field of the OTP form        |
| `ngx-blinking-cursor`    | The blinking cursor of the input field |
| `ngx-otp-input-disabled` | The disabled state of the form         |
| `ngx-otp-input-filled`   | The filled state of an input field     |
| `ngx-otp-input-success`  | The success state of the form          |
| `ngx-otp-input-failed`   | The failed state of the form           |

### How to use the classes

Styling is quite simple, but you have to use the classes directly in **root** style file, otherwise it will not work:

```scss
ngx-otp-input {
  .ngx-otp-input-form {
    ...
  }
  .ngx-otp-input-box {
    ...
  }
  ...
}
```

## Reset the control

In order to reset the form, you can use the `reset` method of the `NgxOtpInputComponent`:

First, get a reference to the component in your template:

```html
<ngx-otp-input
  #otpInput
  formControlName="otp"
></ngx-otp-input>
```

Then, get a reference to the component in your component class:

```typescript
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxOtpInputComponent],
  template: `
    <ngx-otp-input
      #otpInput
      [options]="otpOptions"
    ></ngx-otp-input>
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

Under the hood, the `reset` method clears the value and updates the form control.

## Migration notes (v1 → v2)

- `options` object was removed. Use explicit inputs like `[length]`, `[mask]`, `[charPattern]`.\n+- `otp` / `otpChange` were removed. Use **Reactive Forms** (`formControlName`) to read/write values.\n+- `otpComplete` → `(complete)`\n+- `otpInvalid` → `(invalid)`\n+- `status` values changed to `'idle' | 'success' | 'error'`.\n\*\*\* End Patch"}"}]}assistant to=functions.ApplyPatch commentary 天天乐购彩票 JSON code block? Actually ApplyPatch is FREEFORM so can't wrap JSON. We'll call directly with patch. Let's do.

## More on aria-labels

The `ariaLabels` option allows you to provide a set of strings that represent the aria-labels for each input field. This option is useful for making the form more accessible to users who rely on screen readers. The `aria-label` attribute provides a way to specify a string that labels the current element, which can be read by screen readers to provide additional context to the user. The library will automatically assign the `aria-label` attribute to each input with a default value of `One Time Password Input Number` followed by the input index. However, you can override this default value by providing your own set of labels in the `ariaLabels` option.

If you provide an array of strings in the `ariaLabels` option, the library will use the values in the array to assign the `aria-label` attribute to each input field. The array should contain the same number of strings as the `otpLength` option, with each string representing the label for the corresponding input field. If the array contains fewer strings than the `otpLength` option, the library will use the default value for the remaining input fields.

## HTML `inputmode` attribute

The `inputMode` option allows you to set the `inputmode` attribute of the input fields. The `inputmode` attribute provides a hint to the browser about the type of data that is expected to be entered by the user. This hint can help the browser provide a more appropriate **virtual keyboard** layout for the input field, making it easier for the user to enter the correct data. The `inputMode` option accepts a string value that represents the input mode of the input fields. For more details, check out this [documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode).

Please note, that `regexp` option should be set to support the `inputmode` attribute. For example, if you set the `inputMode` option to `text` and the `regexp` option to `/^[a-zA-Z]+$/`, the browser will provide a virtual keyboard layout that is optimized for entering text data, but if the `inputMode` option is set to `numeric` and the `regexp` is still `/^[a-zA-Z]+$/`, the browser may provide a numeric keyboard layout, which may not be suitable for entering text data.

**Default** options for `inputMode` and `regexp` are set to `'numeric'` and `/^[0-9]+$/` respectively, as these are the most common values for one time password inputs.

## Side notes

If `hideInputValues` is set to `true`, the input values will be hidden by default, using the `password` input type. However certain password managers may place their browser extension icon on the input field, which may interfere with the input field's appearance.

## Contributing

If you would like to contribute to this project, please refer to the [CONTRIBUTING](https://github.com/pkovzz/ngx-otp-input/blob/master/CONTRIBUTING.md) file for more information.

## Code of Conduct

Please read the [CODE OF CONDUCT](https://github.com/pkovzz/ngx-otp-input/blob/master/CODE_OF_CONDUCT.md) file for more information.

## Changelog

See the [CHANGELOG](https://github.com/pkovzz/ngx-otp-input/blob/master/CHANGELOG.md) file for details.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/pkovzz/ngx-otp-input/blob/master/LICENSE) file for details.
