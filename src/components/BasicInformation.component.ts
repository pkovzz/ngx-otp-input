import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-basic-information',
  template: `
    <div
      id="alert-additional-content-1"
      class="p-4 text-blue-800 border border-solid border-blue-300 rounded-lg bg-blue-50"
      role="alert"
    >
      <div class="flex items-center">
        <svg
          class="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
          />
        </svg>
        <span class="sr-only">Info</span>
        <h3 class="text-lg font-medium">About this demo site</h3>
      </div>
      <div class="text-sm">
        <p class="mt-0">
          This is just a quick demo showcasing the
          <b>ngx-otp-input</b> component. You can configure the component
          options below and see the changes in the preview. This demo does not
          include every possible configuration option, for more information
          check out the
          <a
            href="https://github.com/pkovzz/ngx-otp-input"
            target="_blank"
            >documentation page</a
          >.
        </p>
        <p>To apply the changes, click the <i>Apply changes</i> button.</p>
        <p>
          If you like the library, please consider giving it a star on GitHub!
          🌟
        </p>
      </div>
    </div>
  `,
})
export class BasicInformationComponent {}
