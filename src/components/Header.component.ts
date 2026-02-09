import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <header
      class="sticky top-0 z-50 backdrop-blur-lg bg-[var(--color-stone-50)]/80 border-b border-[var(--color-stone-200)]"
    >
      <div class="section-container flex items-center justify-between h-16">
        <a
          href="/"
          class="flex items-center gap-2.5 no-underline group"
        >
          <span
            class="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white font-heading font-bold text-sm"
          >
            O
          </span>
          <span
            class="font-heading font-semibold text-lg text-[var(--color-stone-900)] tracking-tight"
          >
            ngx-otp-input
          </span>
        </a>

        <nav class="flex items-center gap-6">
          <a
            href="#examples"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline"
          >
            Examples
          </a>
          <a
            href="#playground"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline"
          >
            Playground
          </a>
          <a
            href="#api"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline"
          >
            API
          </a>
          <a
            href="https://github.com/pkovzz/ngx-otp-input"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-sm font-medium text-[var(--color-stone-600)] hover:text-[var(--color-stone-900)] transition-colors no-underline"
            aria-label="View on GitHub"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
