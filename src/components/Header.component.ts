import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <div>
      <div class="flex items-center justify-between">
        <h1>ngx-otp-input</h1>
        <a
          class="github-button"
          href="https://github.com/pkovzz/ngx-otp-input"
          data-icon="octicon-star"
          data-size="large"
          data-show-count="true"
          aria-label="Star pkovzz/ngx-otp-input on GitHub"
          >Star</a
        >
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <img
          alt="GitHub License"
          src="https://img.shields.io/github/license/pkovzz/ngx-otp-input"
        />
        <img
          alt="GitHub Tag"
          src="https://img.shields.io/github/v/tag/pkovzz/ngx-otp-input"
        />
        <img
          alt="GitHub tag status"
          src="https://img.shields.io/github/checks-status/pkovzz/ngx-otp-input/v1.1.0"
        />
        <img
          alt="NPM Downloads"
          src="https://img.shields.io/npm/dm/ngx-otp-input"
        />
      </div>
    </div>
  `,
})
export class HeaderComponent {}
