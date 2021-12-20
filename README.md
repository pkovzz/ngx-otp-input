# ngx-otp-input

**ngx-otp-input** is a simple one time password input library for Angular.

### Demo page

http://ngx-otp-input.vercel.app

### StackBlitz example

https://stackblitz.com/edit/angular-ngx-otp-input

## Overview

- [Install](#install)
- [Usage](#usage)
- [@Input()](#input)
- [@Output()](#output)
- [Configurations](#configurations)
- [Styling](#styling)
- [How to clear values](#clear)
- [Difference between behaviors](#behaviors)
- [Side notes](#side-notes)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Install

```
npm i ngx-otp-input --save
```

_You can find the package on [NPM](https://www.npmjs.com/package/ngx-otp-input)._

## Usage

Import **NgxOtpInputModule** to your module:

```javascript
import { NgxOtpInputModule } from 'ngx-otp-input';

@NgModule({
  imports: [NgxOtpInputModule],
})
export class MySuperModule {}
```

Set up the [configuration](#configurations) object in your component file:

```javascript
otpInputConfig: NgxOtpInputConfig = {
  otpLength: 6,
  autoFocus: true,
  ...
};
```

Then use the `<ngx-otp-input>` tag with your config in your template file:

```html
<ngx-otp-input [config]="otpInputConfig"></ngx-otp-input>
```

## Input

The following `@Input()` properties are:

### [config]

The configuration object set the library's initial behavior.

| Property | Type              | Required |
| -------- | ----------------- | -------- |
| [config] | NgxOtpInputConfig | true     |

For more information, check the [configurations](#configurations) section.

### [disable]

Disable inputs.

| Property  | Type    | Required | Default value |
| --------- | ------- | -------- | ------------- |
| [disable] | boolean | false    | false         |

### [status]

Set a visible status to the component. This status will apply `inputSuccess` or `inputError` styles.

| Property | Value                | Required | Default value |
| -------- | -------------------- | -------- | ------------- |
| [status] | "success" or "error" | false    | -             |

For more information, check the [styling](#styling) section.

## Output

### (otpChange)

Emit a string array value on every input change.

### (fill)

Emit the final value as a single string when every input is filled and valid.

## Configurations

| Property         | Type                 | Required | Default value             | Description                                                                                                                                                                                                                                  |
| ---------------- | -------------------- | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| otpLength        | number               | true     | 6                         | Set the number of inputs.                                                                                                                                                                                                                    |
| pattern          | RegExp               | false    | `/^\d+$/` (numbers only)  | Determines which characters are allowed according to a RegExp pattern.                                                                                                                                                                       |
| autofocus        | boolean              | false    | true                      | Set focus on the first input on component's load.                                                                                                                                                                                            |
| autoblur         | boolean              | false    | true                      | Remove focus when every input box is filled.                                                                                                                                                                                                 |
| isPasswordInput  | boolean              | false    | false                     | Set the type of the inputs. It can be `text` or `password`. Check [side notes](#If-input-type-is-password).                                                                                                                                  |
| ariaLabels       | string _or_ string[] | false    | "One time password input" | Set the aria label attribute to the `label` tag around the input. Check [side notes](#If-you-set-a-single-string-as-aria-label).                                                                                                             |
| classList        | NgxOtpStyles         | false    | -                         | `classList` is an object, which contains further properties, each with the type of string or string[]. These properties are addressing certain elements of the component. For more information, please read the [Styling](#styling) section. |
| numericInputMode | boolean              | false    | -                         | Set [HTML input mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode) to numeric. If this is set, the config's **pattern** property will be forced to the default value (numbers only).                       |
| behavior         | NgxOtpBehavior       | false    | DEFAULT                   | From version 0.11.0, ngx-otp-input's behaviour has changed. See more on [Difference between behaviors](#behaviors).                                                                                                                          |

## Styling

To apply css classes to certain parts of the library, you have to define them in the configuration object's `classList`
property as mentioned above. Each property has the type `string` or `string[]`. These classes will be applied
as [[ngClass]](https://angular.io/api/common/NgClass).

Here is an example:

```javascript
otpInputConfig: NgxOtpInputConfig = {
  classList: {
    input: 'my-super-class',
    inputFilled: 'my-super-filled-class',
    inputDisabled: 'my-super-disable-class',
    inputSuccess: 'my-super-success-class',
    inputError: 'my-super-error-class',
  },
};
```

You can use these properties:

| Property      | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| container     | The top level container. Default class is `ngx-otp-input-container`.       |
| inputBox      | The wrapper element of each input. Default class is `ngx-otp-input-box`    |
| input         | The input element itself. Default class is `ngx-otp-input`.                |
| inputFilled   | The set class will be only applied if the input has some value.            |
| inputDisabled | The set class will be only applied, if the `[disabled]` option is `true`.  |
| inputSuccess  | The set class will be only applied, if the `[status]` option is `success`. |
| inputError    | The set class will be only applied, if the `[status]` option is `error`.   |

### How to apply new styles

For now, the recommended way to customize the component is to use the `styles.scss` file in your app's root like this:

```scss
ngx-otp-input {
  .my-new-special-class {
    ...
  }
}
```

### How to override existing styles

Same as applying new styles, but you have to address it more precisely. You can find the default classes above.

```scss
ngx-otp-input {
  .ngx-otp-input-box.my-new-special-box-class {
    ...
  }
}
```

## Clear

Sometimes you may want to clear the input's value. To do this, invoke the library's `clear` method.

First, add a template reference variable as a string:

```angular2html
<ngx-otp-input #ngxotp></ngx-otp-input>
```

Now you access it in your parent component like this:

```typescript
export class AppComponent {
  @ViewChild('ngxotp') ngxOtp: NgxOtpInputComponent;

  mySuperEvent(): void {
    this.ngxOtp.clear();
  }
}
```

## Behaviors

Try the [demo](http://ngx-otp-input.vercel.app) to see the differences.

### Default

By default, when the user hit the backspace key, the focused box's value will be cleared and the focus will jump backwards.

### Legacy

With "legacy" behavior, there is a check before deletion. First, we check if the focused box has value. If so, we delete the value but the focus remains on the same box. If the user hit the backspace on an empty box, only then will the focus jump backwards.

## Side notes

### If input type is password

Password managers like 1Password or NordPass could place their icon into the inputs and causes design issues.

### If you set a single string as aria label

It will be applied to every label. However, you can set different aria label text for
each input if you provide them as a string array. Please note, that if the given array's length is less than the number
of inputs, the leftover will get the default value.

## Contributing

See more [here](CONTRIBUTING.md).

## Changelog

You can find the previous changes [here](CHANGELOG.md).

## License

[MIT](LICENSE)
