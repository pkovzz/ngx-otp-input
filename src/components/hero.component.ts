import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxOtpInputComponent } from 'ngx-otp-input';

@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule, ReactiveFormsModule, NgxOtpInputComponent],
  template: `
    <section class="relative overflow-hidden">
      <!-- Dot grid background -->
      <div
        class="absolute inset-0 dot-grid-bg opacity-40"
        aria-hidden="true"
      ></div>

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-[var(--color-stone-50)] via-transparent to-[var(--color-stone-50)]"
        aria-hidden="true"
      ></div>

      <div class="relative section-container pt-20 pb-24 md:pt-28 md:pb-32">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Badge -->
          <div class="animate-fade-in-up">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent-muted)]"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"
              ></span>
              v2.0 — Redesigned
            </span>
          </div>

          <!-- Heading -->
          <h1
            class="mt-6 text-4xl sm:text-5xl md:text-6xl font-heading font-800 tracking-tight text-[var(--color-stone-900)] animate-fade-in-up delay-100"
          >
            Boxed OTP Input
            <br />
            <span class="text-[var(--color-accent)]">for Angular</span>
          </h1>

          <!-- Subtitle -->
          <p
            class="mt-5 text-lg md:text-xl text-[var(--color-stone-500)] max-w-xl mx-auto animate-fade-in-up delay-200"
          >
            A standalone component with accessibility, SMS autofill, paste
            support, and seamless reactive forms integration.
          </p>

          <!-- Install command -->
          <div class="mt-8 animate-fade-in-up delay-300">
            <div
              class="inline-flex items-center gap-3 px-5 py-3 bg-[var(--color-stone-900)] rounded-xl text-sm"
            >
              <span class="text-[var(--color-stone-400)]">$</span>
              <code class="text-[var(--color-stone-100)] font-mono"
                >npm install ngx-otp-input</code
              >
              <button
                type="button"
                (click)="copyInstall()"
                class="ml-1 p-1 rounded-md hover:bg-[var(--color-stone-700)] transition-colors cursor-pointer border-0 bg-transparent"
                [attr.aria-label]="copied ? 'Copied!' : 'Copy to clipboard'"
              >
                @if (copied) {
                  <svg
                    class="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                } @else {
                  <svg
                    class="w-4 h-4 text-[var(--color-stone-400)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                }
              </button>
            </div>
          </div>

          <!-- CTA buttons -->
          <div
            class="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-400"
          >
            <a
              href="#playground"
              class="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] transition-colors no-underline"
            >
              Try the Playground
            </a>
            <a
              href="https://github.com/pkovzz/ngx-otp-input"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border border-[var(--color-stone-200)] text-[var(--color-stone-700)] hover:bg-[var(--color-stone-100)] transition-colors no-underline"
            >
              Documentation
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          <!-- Hero OTP demo -->
          <div class="mt-14 animate-fade-in-up delay-500">
            <div class="hero-otp flex justify-center">
              <ngx-otp-input
                [formControl]="heroOtp"
                [length]="4"
                [autoFocus]="false"
                [autoBlur]="true"
              ></ngx-otp-input>
            </div>
            <p class="mt-3 text-sm text-[var(--color-stone-400)]">
              Try typing or pasting a code above
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  heroOtp = new FormControl('', { nonNullable: true });
  copied = false;

  copyInstall(): void {
    navigator.clipboard.writeText('npm install ngx-otp-input').then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
