import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-features',
  imports: [CommonModule],
  template: `
    <section
      class="py-20 bg-[var(--color-surface-0)] border-y border-[var(--color-stone-100)]"
    >
      <div class="section-container">
        <div class="text-center mb-14">
          <h2
            class="text-3xl md:text-4xl font-heading font-700 tracking-tight text-[var(--color-stone-900)]"
          >
            Built for real-world apps
          </h2>
          <p
            class="mt-3 text-[var(--color-stone-500)] text-lg max-w-xl mx-auto"
          >
            Everything you need for a production-grade OTP experience, out of
            the box.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (feature of features; track feature.title) {
            <div
              class="group p-6 rounded-xl border border-[var(--color-stone-100)] bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-0)] hover:shadow-[var(--shadow-card)] hover:border-[var(--color-stone-200)] transition-all duration-300"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4 bg-[var(--color-accent-subtle)] border border-[var(--color-accent-muted)]"
              >
                {{ feature.icon }}
              </div>
              <h3
                class="font-heading font-600 text-base text-[var(--color-stone-900)] mb-1.5"
              >
                {{ feature.title }}
              </h3>
              <p
                class="text-sm text-[var(--color-stone-500)] leading-relaxed m-0"
              >
                {{ feature.description }}
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      icon: '\u2699\uFE0F',
      title: 'Reactive Forms',
      description:
        'Implements ControlValueAccessor for seamless integration with Angular reactive and template-driven forms.',
    },
    {
      icon: '\u267F',
      title: 'Accessible',
      description:
        'ARIA labels, live regions for status announcements, keyboard navigation, and screen reader support built in.',
    },
    {
      icon: '\uD83D\uDCCB',
      title: 'Paste Support',
      description:
        'Smart paste handling that validates and fills all boxes at once, perfect for copying from SMS or email.',
    },
    {
      icon: '\uD83D\uDCF1',
      title: 'Mobile-First',
      description:
        'Configurable inputMode for optimal virtual keyboards, SMS autofill support via autocomplete hints.',
    },
    {
      icon: '\uD83C\uDFA8',
      title: 'Customizable',
      description:
        'CSS classes for every state: active, filled, success, error, disabled. Fully styleable to match your brand.',
    },
    {
      icon: '\uD83D\uDD12',
      title: 'Input Validation',
      description:
        'Per-character regex validation with configurable patterns. Support for numeric, alphanumeric, or custom rules.',
    },
  ];
}
