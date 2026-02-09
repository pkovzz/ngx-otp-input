import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-footer',
  template: `
    <footer
      class="py-12 border-t border-[var(--color-stone-200)] bg-[var(--color-stone-50)]"
    >
      <div class="section-container">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <!-- Left: branding -->
          <div class="flex items-center gap-2.5">
            <span
              class="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--color-accent)] text-white font-heading font-bold text-xs"
            >
              O
            </span>
            <span
              class="font-heading font-semibold text-[var(--color-stone-800)] tracking-tight"
            >
              ngx-otp-input
            </span>
            <span class="text-xs text-[var(--color-stone-400)]">v2.0</span>
          </div>

          <!-- Center: links -->
          <nav class="flex items-center gap-6">
            <a
              href="https://github.com/pkovzz/ngx-otp-input"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-stone-500)] hover:text-[var(--color-stone-800)] transition-colors no-underline"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/ngx-otp-input"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-stone-500)] hover:text-[var(--color-stone-800)] transition-colors no-underline"
            >
              npm
            </a>
            <a
              href="https://github.com/pkovzz/ngx-otp-input/blob/master/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-stone-500)] hover:text-[var(--color-stone-800)] transition-colors no-underline"
            >
              Changelog
            </a>
            <a
              href="https://github.com/pkovzz/ngx-otp-input/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-stone-500)] hover:text-[var(--color-stone-800)] transition-colors no-underline"
            >
              MIT License
            </a>
          </nav>

          <!-- Right: credit -->
          <p class="text-xs text-[var(--color-stone-400)] m-0">
            Built with Angular. Deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
