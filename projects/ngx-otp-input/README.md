# NgxOtpInput

NgxOtpInput is a simple one time password input library for Angular.

### Demo page

link

### StackBlitz example

link

## Overview

- [Install](#install)
- [Usage](#usage)
- [Options](#options)
- [Styling](#Styling)
- [License](#License)

## Install

## Usage

You need to import NgxOtpInputModule to your module:

```javascript
import { NgxOtpInputModule } from 'ngx-otp-input';

@NgModule({
  imports: [NgxOtpInputModule],
})
export class MySuperModule {}
```

Set up the configuration object in your component file like so:

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
- [(otpChange)](#otpChange)
- [(fill)](#fill)

**[config]**

The configuration object sets the library's initial state.

| Property | Type              | Required |
| -------- | ----------------- | -------- |
| [config] | NgxOtpInputConfig | true     |

NgxOtpInputConfig has the following properties:

**otpLength**

Sets the number of inputs.

| Property  | Type   | Required |
| --------- | ------ | -------- |
| otpLength | number | true     |

**pattern**

Determines which characters be allowed according to a RegExp pattern.

| Property | Type   | Required | Default value            |
| -------- | ------ | -------- | ------------------------ |
| pattern  | number | false    | `/^\d+$/` (numbers only) |

**autofocus**

Set focus on the first input on component's load.

| Property  | Type    | Required | Default value |
| --------- | ------- | -------- | ------------- |
| autofocus | boolean | false    | false         |

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

If you set only a sngle string, it will be applied to every label. However, you can set
different aria label text for each input if you provide them as a string array.
Please note, that if the given array's length is less than the number of inputs,
the leftover will get the default value.

**classList**

`classList` is an object, which contains …

| Property  | Type   | Required | Default value |
| --------- | ------ | -------- | ------------- |
| classList | object | false    | -             |

For more, please read the Styling section.

## Styling

To apply css classes to certain parts of the library, you have to define them in
the configuration object's `classList` property as mentioned above. Each property has the type `string` or `string[]`.
These classes will be applied as [[ngClass]](#https://angular.io/api/common/NgClass).

You can use these properties:

- container
- inputBox
- input
- inputFilled
- inputDisabled
- inputSuccess
- inputError

**container**  
The top level container. Default class is `ngx-otp-input-container`.

**inputBox**  
The wrapper element of each input. Default class is `ngx-otp-input-box`

**input**  
The input element itself. Default class is `ngx-otp-input`.

**inputFilled**  
The set class will be only applied if the input has some value.

**inputDisabled**  
The set class will be only applied, if the `[disabled]` option is `true`.

**inputSuccess**  
The set class will be only applied, if the `[status]` option is `success`.

**inputError**  
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

For now, the recommended way to customize the component is to use the `styles.scss` file in your
app's root like this:

```scss
ngx-otp-input {
  .my-super-class {
    ...
  }
}
```

### How to override existing styles

Same as applying new styles, but you have to address it is more precisely. You can find the default
classes above.

```scss
ngx-otp-input {
  .ngx-otp-input-box.my-super-box-class {
    ...
  }
}
```

## License

[MIT](LICENSE)
