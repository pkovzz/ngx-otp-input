# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.9.1] - 2021-08-19

- Fix `[disabled]` input property

## [0.9.0] - 2021-05-05

- Add `autoblur` configuration option.  
  For more information, please see the documentation.

## [0.8.0] - 2021-04-20

- Add `clear` method.  
  For more information, please see the documentation.

## [0.7.0] - 2021-04-17

- Add `numericInputMode` config property.  
  For more information, please see the documentation.

## [0.6.6] - 2021-03-27

- Fix missed inputs

## [0.6.3] - 2021-03-18

- Fix ngClass error when no custom class is set

## [0.6.2] - 2021-03-18

### Fixed

- Applying workaround regard to this: https://github.com/angular/angular/issues/38391

## [0.6.1] - 2021-03-17

### Fixed

- Preventing too fast typing, which could cause unregistered inputs
- The custom ["filled"](https://github.com/pkovzz/ngx-otp-input#inputfilled)
  style is now applied on every input after _paste_ event
