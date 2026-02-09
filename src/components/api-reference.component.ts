import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ApiRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-api-reference',
  imports: [CommonModule],
  template: `
    <section
      id="api"
      class="py-20"
    >
      <div class="section-container">
        <div class="text-center mb-14">
          <h2
            class="text-3xl md:text-4xl font-heading font-700 tracking-tight text-[var(--color-stone-900)]"
          >
            API Reference
          </h2>
          <p
            class="mt-3 text-[var(--color-stone-500)] text-lg max-w-xl mx-auto"
          >
            Complete reference for inputs, outputs, and CSS styling hooks.
          </p>
        </div>

        <!-- Inputs -->
        <div class="mb-12">
          <h3 class="api-section-title">
            <span class="api-section-badge">@Input</span>
            Inputs
          </h3>
          <div class="api-table-wrapper">
            <table class="api-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                @for (row of inputs; track row.name) {
                  <tr>
                    <td>
                      <code class="api-prop-name">{{ row.name }}</code>
                    </td>
                    <td>
                      <code class="api-type">{{ row.type }}</code>
                    </td>
                    <td>
                      <code class="api-default">{{ row.default }}</code>
                    </td>
                    <td class="api-desc">{{ row.description }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Outputs -->
        <div class="mb-12">
          <h3 class="api-section-title">
            <span class="api-section-badge output">@Output</span>
            Outputs
          </h3>
          <div class="api-table-wrapper">
            <table class="api-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Payload</th>
                  <th colspan="2">Description</th>
                </tr>
              </thead>
              <tbody>
                @for (row of outputs; track row.name) {
                  <tr>
                    <td>
                      <code class="api-prop-name">{{ row.name }}</code>
                    </td>
                    <td>
                      <code class="api-type">{{ row.type }}</code>
                    </td>
                    <td
                      colspan="2"
                      class="api-desc"
                    >
                      {{ row.description }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- CSS Classes -->
        <div>
          <h3 class="api-section-title">
            <span class="api-section-badge css">CSS</span>
            Styling Classes
          </h3>
          <p class="text-sm text-[var(--color-stone-500)] mb-4 -mt-2">
            Override these classes in your root stylesheet to customize the
            component appearance.
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (cls of cssClasses; track cls.name) {
              <div
                class="flex flex-col gap-1 p-4 rounded-lg border border-[var(--color-stone-100)] bg-white"
              >
                <code
                  class="text-sm font-semibold text-[var(--color-accent)] font-mono"
                  >.{{ cls.name }}</code
                >
                <span class="text-xs text-[var(--color-stone-500)]">{{
                  cls.description
                }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .api-section-title {
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: 1.125rem;
        color: var(--color-stone-900);
        display: flex;
        align-items: center;
        gap: 0.625rem;
        margin: 0 0 1rem;
      }

      .api-section-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.5rem;
        font-family: var(--font-mono);
        font-size: 0.7rem;
        font-weight: 600;
        border-radius: var(--radius-sm);
        background: var(--color-accent-subtle);
        color: var(--color-accent);
        border: 1px solid var(--color-accent-muted);
      }

      .api-section-badge.output {
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #bfdbfe;
      }

      .api-section-badge.css {
        background: #f5f3ff;
        color: #6d28d9;
        border-color: #ddd6fe;
      }

      .api-table-wrapper {
        overflow-x: auto;
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-stone-200);
      }

      .api-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
        background: white;
      }

      .api-table thead {
        background: var(--color-stone-50);
      }

      .api-table th {
        padding: 0.75rem 1rem;
        text-align: left;
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-stone-500);
        border-bottom: 1px solid var(--color-stone-200);
      }

      .api-table td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--color-stone-100);
        vertical-align: top;
      }

      .api-table tbody tr:last-child td {
        border-bottom: none;
      }

      .api-prop-name {
        font-family: var(--font-mono);
        font-weight: 600;
        font-size: 0.8125rem;
        color: var(--color-stone-900);
        white-space: nowrap;
      }

      .api-type {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-accent);
        background: var(--color-accent-subtle);
        padding: 0.0625rem 0.375rem;
        border-radius: var(--radius-sm);
        white-space: nowrap;
      }

      .api-default {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-stone-500);
        white-space: nowrap;
      }

      .api-desc {
        color: var(--color-stone-600);
        line-height: 1.5;
      }
    `,
  ],
})
export class ApiReferenceComponent {
  inputs: ApiRow[] = [
    {
      name: 'length',
      type: 'number',
      default: '6',
      description: 'Number of OTP boxes / expected code length.',
    },
    {
      name: 'autoFocus',
      type: 'boolean',
      default: 'true',
      description: 'Focus the input automatically on init.',
    },
    {
      name: 'autoBlur',
      type: 'boolean',
      default: 'true',
      description: 'Blur the input when OTP is complete.',
    },
    {
      name: 'mask',
      type: 'boolean',
      default: 'false',
      description: 'Render characters as dots (password-like).',
    },
    {
      name: 'charPattern',
      type: 'RegExp',
      default: '/^\\d$/',
      description:
        'Per-character regex allowlist. Characters not matching are rejected.',
    },
    {
      name: 'inputMode',
      type: 'string',
      default: "'numeric'",
      description: 'Hint for virtual keyboard layout on mobile.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "'One Time Password'",
      description: 'Accessible label for the input group.',
    },
    {
      name: 'status',
      type: "'idle' | 'success' | 'error'",
      default: "'idle'",
      description: 'Visual and screen-reader status state.',
    },
    {
      name: 'statusMessages',
      type: '{ success?: string; error?: string }',
      default: 'See defaults',
      description: 'Custom screen-reader messages for status states.',
    },
  ];

  outputs: ApiRow[] = [
    {
      name: 'change',
      type: '{ value: string; isComplete: boolean }',
      default: '',
      description: 'Emitted whenever the OTP value changes.',
    },
    {
      name: 'complete',
      type: 'string',
      default: '',
      description: 'Emitted when the OTP reaches full length.',
    },
    {
      name: 'invalid',
      type: "{ reason: 'too-long' | 'char-rejected'; attemptedValue: string; acceptedValue: string }",
      default: '',
      description: 'Emitted when input is rejected during sanitization.',
    },
  ];

  cssClasses = [
    {
      name: 'ngx-otp-input-form',
      description: 'Main container wrapping all OTP boxes.',
    },
    {
      name: 'ngx-otp-input-box',
      description: 'Individual OTP character box.',
    },
    {
      name: 'ngx-otp-input-active',
      description: 'Currently focused / active box.',
    },
    {
      name: 'ngx-otp-input-filled',
      description: 'Box that has a character entered.',
    },
    {
      name: 'ngx-otp-input-success',
      description: 'Applied when status is "success".',
    },
    {
      name: 'ngx-otp-input-failed',
      description: 'Applied when status is "error".',
    },
    {
      name: 'ngx-otp-input-disabled',
      description: 'Applied when the control is disabled.',
    },
  ];
}
