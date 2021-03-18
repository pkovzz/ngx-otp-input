# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.6.2] - 2021-03-18

### Fixed

- Applying workaround regard to this: https://github.com/angular/angular/issues/38391

## [0.6.1] - 2021-03-17

### Fixed

- Preventing too fast typing, which could cause unregistered inputs
- The custom ["filled"](https://github.com/pkovzz/ngx-otp-input#inputfilled)
  style is now applied on every input after _paste_ event
