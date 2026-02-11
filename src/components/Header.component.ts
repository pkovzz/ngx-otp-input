import { Component, EventEmitter, Input, Output } from '@angular/core';

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

        <nav class="flex items-center gap-3 sm:gap-6">
          <a
            href="#examples"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-1)] rounded-sm"
          >
            Examples
          </a>
          <a
            href="#playground"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-1)] rounded-sm"
          >
            Playground
          </a>
          <a
            href="#api"
            class="hidden sm:inline text-sm font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-900)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-1)] rounded-sm"
          >
            API
          </a>
          <button
            type="button"
            class="theme-toggle"
            (click)="themeToggle.emit()"
            [attr.aria-label]="
              isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'
            "
            [attr.aria-pressed]="isDarkTheme"
            title="Toggle theme"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              @if (isDarkTheme) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M21.75 15.002A9 9 0 119.002 2.25 7.5 7.5 0 0021.75 15.002z"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M12 3v2.25m0 13.5V21m-6.364-2.636l1.591-1.591m10.546 0l1.591 1.591M3 12h2.25m13.5 0H21M5.636 5.636l1.591 1.591m10.546-1.591l-1.591 1.591M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              }
            </svg>
            <span class="hidden sm:inline">{{
              isDarkTheme ? 'Dark' : 'Light'
            }}</span>
          </button>
          <a
            href="https://github.com/pkovzz/ngx-otp-input"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-sm font-medium text-[var(--color-stone-600)] hover:text-[var(--color-stone-900)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-1)] rounded-sm"
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
  styles: [
    `
      .theme-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        background: var(--color-theme-toggle-bg);
        color: var(--color-stone-700);
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        line-height: 1;
        padding: 0.45rem 0.75rem;
        cursor: pointer;
        transition:
          background-color 0.2s ease,
          border-color 0.2s ease,
          color 0.2s ease,
          transform 0.2s ease;
      }

      .theme-toggle:hover {
        background: var(--color-theme-toggle-hover);
        border-color: var(--color-stone-300);
        color: var(--color-stone-900);
      }

      .theme-toggle:focus-visible {
        outline: none;
        box-shadow:
          0 0 0 2px rgb(0 0 0 / 0),
          0 0 0 4px color-mix(in srgb, var(--color-accent) 45%, transparent);
      }

      .theme-toggle:active {
        transform: translateY(1px);
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() isDarkTheme = false;
  @Output() themeToggle = new EventEmitter<void>();
}
