# NgxOtpInput

NgxOtpInput is a simple one time password input library for Angular.

### Demo page

http://ngx-otp-input.vercel.app

### StackBlitz example

https://stackblitz.com/edit/angular-ngx-otp-input

## Overview

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
- [Clear](#clear)
- [Styling](#styling)
- [License](#license)

## Install

```
npm i ngx-otp-input --save
```

## Usage

Import NgxOtpInputModule to your module:

```javascript
import { NgxOtpInputModule } from 'ngx-otp-input';

@NgModule({
  imports: [NgxOtpInputModule],
})
export class MySuperModule {}
```

Set up the configuration object in your component file:

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

## Options

- [[config]](#config)
- [[status]](#status)
- [[disable]](#disable)
- [(otpChange)](#otpchange)
- [(fill)](#fill)

### [config]

The configuration object set the library's initial state.

| Property | Type              | Required |
| -------- | ----------------- | -------- |
| [config] | NgxOtpInputConfig | true     |

`NgxOtpInputConfig` has the following properties:

**otpLength**

Set the number of inputs.

| Property  | Type   | Required |
| --------- | ------ | -------- |
| otpLength | number | true     |

**pattern**

Determines which characters are allowed according to a RegExp pattern.

| Property | Type   | Required | Default value            |
| -------- | ------ | -------- | ------------------------ |
| pattern  | RegExp | false    | `/^\d+$/` (numbers only) |

**autofocus**

Set focus on the first input on component's load.

| Property  | Type    | Required | Default value |
| --------- | ------- | -------- | ------------- |
| autofocus | boolean | false    | false         |

**autoblur**

Remove focus when every input box is filled.

| Property | Type    | Required | Default value |
| -------- | ------- | -------- | ------------- |
| autoblur | boolean | false    | true          |

**isPasswordInput**

Set the type of the inputs. It can be `text` or `password`.

| Property        | Type    | Required | Default value |
| --------------- | ------- | -------- | ------------- |
| isPasswordInput | boolean | false    | false         |

**ariaLabels**

Set the aria label attribute to the `label` tag around the input.

| Property   | Type               | Required | Default value             |
| ---------- | ------------------ | -------- | ------------------------- |
| ariaLabels | string or string[] | false    | "One time password input" |

If you set a single string, it will be applied to every label. However, you can set different aria label text for
each input if you provide them as a string array. Please note, that if the given array's length is less than the number
of inputs, the leftover will get the default value.

**classList**

`classList` is an object, which contains further properties, each with the type of string or string[].  
These properties are addressing certain elements of the component.

| Property  | Type   | Required | Default value |
| --------- | ------ | -------- | ------------- |
| classList | object | false    | -             |

For more information, please read the [Styling](#styling) section.

**numericInputMode**

Set input mode to numeric. For the better UX on mobile devices,
this will be enabled by default if the `pattern` property did not set.

| Property         | Type    | Required | Default value |
| ---------------- | ------- | -------- | ------------- |
| numericInputMode | boolean | false    | -             |

Note: Do not use with `pattern` which allows any other characters than numbers.

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

For more information, please read the [Styling](#styling) section.

### (otpChange)

Emit a string array value on every input change.

### (fill)

Emit the final value as a string when every input is filled.

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

## Styling

To apply css classes to certain parts of the library, you have to define them in the configuration object's `classList`
property as mentioned above. Each property has the type `string` or `string[]`. These classes will be applied
as [[ngClass]](https://angular.io/api/common/NgClass).

You can use these properties:

- [container](#container)
- [inputBox](#inputbox)
- [input](#input)
- [inputFilled](#inputfilled)
- [inputDisabled](#inputdisabled)
- [inputSuccess](#inputsuccess)
- [inputError](#inputerror)

### container

The top level container. Default class is `ngx-otp-input-container`.

### inputBox

The wrapper element of each input. Default class is `ngx-otp-input-box`

### input

The input element itself. Default class is `ngx-otp-input`.

### inputFilled

The set class will be only applied if the input has some value.

### inputDisabled

The set class will be only applied, if the `[disabled]` option is `true`.

### inputSuccess

The set class will be only applied, if the `[status]` option is `success`.

### inputError

The set class will be only applied, if the `[status]` option is `error`.

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

### How to apply new styles

For now, the recommended way to customize the component is to use the `styles.scss` file in your app's root like this:

```scss
ngx-otp-input {
  .my-super-class {
    ...
  }
}
```

### How to override existing styles

Same as applying new styles, but you have to address it more precisely. You can find the default classes above.

```scss
ngx-otp-input {
  .ngx-otp-input-box.my-super-box-class {
    ...
  }
}
```

## Contributing

See more [here](CONTRIBUTING.md).

## Changelog

You can find the previous changes [here](CHANGELOG.md).

## License

[MIT](LICENSE)
