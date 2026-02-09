import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgxOtpInputComponent,
  OtpChangeEvent,
  OtpInvalidEvent,
  OtpStatus,
} from 'ngx-otp-input';

@Component({
  standalone: true,
  selector: 'app-playground',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxOtpInputComponent,
  ],
  template: `
    <section
      id="playground"
      class="py-20 bg-white border-y border-[var(--color-stone-100)]"
    >
      <div class="section-container">
        <div class="text-center mb-14">
          <h2
            class="text-3xl md:text-4xl font-heading font-700 tracking-tight text-[var(--color-stone-900)]"
          >
            Interactive Playground
          </h2>
          <p
            class="mt-3 text-[var(--color-stone-500)] text-lg max-w-xl mx-auto"
          >
            Configure every option and see changes in real time. Copy the
            generated code for your project.
          </p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Config panel -->
          <div
            class="lg:w-[360px] shrink-0 p-6 rounded-xl border border-[var(--color-stone-200)] bg-[var(--color-stone-50)]"
          >
            <h3
              class="font-heading font-600 text-sm uppercase tracking-wider text-[var(--color-stone-400)] mb-5"
            >
              Configuration
            </h3>

            <!-- Length -->
            <div class="mb-5">
              <label
                for="otp-length"
                class="block text-sm font-medium text-[var(--color-stone-700)] mb-1.5"
              >
                Length
                <span class="text-[var(--color-stone-400)] font-normal ml-1">{{
                  config.length
                }}</span>
              </label>
              <input
                id="otp-length"
                type="range"
                [(ngModel)]="config.length"
                min="2"
                max="8"
                step="1"
                class="w-full accent-[var(--color-accent)]"
                (change)="rebuildComponent()"
              />
              <div
                class="flex justify-between text-xs text-[var(--color-stone-400)] mt-1"
              >
                <span>2</span>
                <span>8</span>
              </div>
            </div>

            <!-- Char pattern -->
            <div class="mb-5">
              <label
                for="otp-charPattern"
                class="block text-sm font-medium text-[var(--color-stone-700)] mb-1.5"
              >
                charPattern
              </label>
              <select
                id="otp-charPattern"
                [(ngModel)]="selectedPattern"
                (change)="onPatternChange()"
                class="w-full px-3 py-2 text-sm border border-[var(--color-stone-200)] rounded-lg bg-white text-[var(--color-stone-800)] outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="numeric">Numeric (/^\\d$/)</option>
                <option value="alpha">Alpha (/^[a-zA-Z]$/)</option>
                <option value="alphanumeric">
                  Alphanumeric (/^[a-zA-Z0-9]$/)
                </option>
              </select>
            </div>

            <!-- Input mode -->
            <div class="mb-5">
              <label
                for="otp-inputMode"
                class="block text-sm font-medium text-[var(--color-stone-700)] mb-1.5"
              >
                inputMode
              </label>
              <select
                id="otp-inputMode"
                [(ngModel)]="config.inputMode"
                class="w-full px-3 py-2 text-sm border border-[var(--color-stone-200)] rounded-lg bg-white text-[var(--color-stone-800)] outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option value="numeric">numeric</option>
                <option value="text">text</option>
                <option value="tel">tel</option>
              </select>
            </div>

            <!-- Status -->
            <div class="mb-5">
              <div
                class="block text-sm font-medium text-[var(--color-stone-700)] mb-1.5"
              >
                status
              </div>
              <div class="flex gap-2">
                @for (s of statuses; track s) {
                  <button
                    type="button"
                    (click)="config.status = s"
                    class="flex-1 px-2 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-all"
                    [class]="
                      config.status === s
                        ? 'bg-[var(--color-stone-900)] text-white border-[var(--color-stone-900)]'
                        : 'bg-white text-[var(--color-stone-600)] border-[var(--color-stone-200)] hover:bg-[var(--color-stone-50)]'
                    "
                  >
                    {{ s }}
                  </button>
                }
              </div>
            </div>

            <!-- Aria label -->
            <div class="mb-5">
              <label
                for="otp-ariaLabel"
                class="block text-sm font-medium text-[var(--color-stone-700)] mb-1.5"
              >
                ariaLabel
              </label>
              <input
                id="otp-ariaLabel"
                type="text"
                [(ngModel)]="config.ariaLabel"
                class="w-full px-3 py-2 text-sm border border-[var(--color-stone-200)] rounded-lg bg-white text-[var(--color-stone-800)] outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            <!-- Toggles -->
            <div class="space-y-3 mb-6">
              <label
                class="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  [(ngModel)]="config.autoFocus"
                  class="w-4 h-4 accent-[var(--color-accent)] rounded"
                />
                <span class="text-sm text-[var(--color-stone-700)]"
                  >autoFocus</span
                >
              </label>
              <label
                class="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  [(ngModel)]="config.autoBlur"
                  class="w-4 h-4 accent-[var(--color-accent)] rounded"
                />
                <span class="text-sm text-[var(--color-stone-700)]"
                  >autoBlur</span
                >
              </label>
              <label
                class="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  [(ngModel)]="config.mask"
                  class="w-4 h-4 accent-[var(--color-accent)] rounded"
                />
                <span class="text-sm text-[var(--color-stone-700)]">mask</span>
              </label>
              <label
                class="flex items-center gap-2.5 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  [(ngModel)]="config.disabled"
                  (change)="toggleDisabled()"
                  class="w-4 h-4 accent-[var(--color-accent)] rounded"
                />
                <span class="text-sm text-[var(--color-stone-700)]"
                  >disabled</span
                >
              </label>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                type="button"
                (click)="resetPlayground()"
                class="flex-1 px-3 py-2 text-sm font-medium rounded-lg border border-[var(--color-stone-200)] text-[var(--color-stone-600)] bg-white hover:bg-[var(--color-stone-50)] cursor-pointer transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                (click)="rebuildComponent()"
                class="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] cursor-pointer transition-colors border-0"
              >
                Rebuild
              </button>
            </div>
          </div>

          <!-- Preview & output -->
          <div class="flex-1 min-w-0">
            <!-- Live preview -->
            <div
              class="p-8 rounded-xl border border-[var(--color-stone-200)] bg-[var(--color-stone-50)] flex flex-col items-center justify-center min-h-[200px]"
            >
              <div
                class="text-xs font-medium text-[var(--color-stone-400)] uppercase tracking-wider mb-6"
              >
                Live Preview
              </div>
              <ngx-otp-input
                #playgroundOtp
                [formControl]="otpControl"
                [length]="config.length"
                [autoFocus]="false"
                [autoBlur]="config.autoBlur"
                [mask]="config.mask"
                [charPattern]="currentPattern"
                [inputMode]="config.inputMode"
                [ariaLabel]="config.ariaLabel"
                [status]="config.status"
                (otpChange)="onOtpChange($event)"
                (otpComplete)="onOtpComplete($event)"
                (otpInvalid)="onOtpInvalid($event)"
              ></ngx-otp-input>

              <div class="mt-6 flex items-center gap-4 text-sm">
                <div class="text-[var(--color-stone-400)]">
                  Value:
                  <span class="font-mono text-[var(--color-stone-700)]">{{
                    otpControl.value || '—'
                  }}</span>
                </div>
                <div
                  class="w-px h-4 bg-[var(--color-stone-200)]"
                  aria-hidden="true"
                ></div>
                <div class="text-[var(--color-stone-400)]">
                  Complete:
                  <span
                    class="font-mono"
                    [class]="
                      isComplete
                        ? 'text-[var(--color-success)]'
                        : 'text-[var(--color-stone-700)]'
                    "
                    >{{ isComplete }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Generated code -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-xs font-medium text-[var(--color-stone-400)] uppercase tracking-wider"
                  >Generated Code</span
                >
                <button
                  type="button"
                  (click)="copyCode()"
                  class="text-xs font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-700)] transition-colors cursor-pointer bg-transparent border-0"
                >
                  {{ codeCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
              <div class="code-block whitespace-pre">{{ generatedCode }}</div>
            </div>

            <!-- Event console -->
            <div class="mt-6">
              <div class="flex items-center justify-between mb-2">
                <span
                  class="text-xs font-medium text-[var(--color-stone-400)] uppercase tracking-wider"
                  >Event Console</span
                >
                <button
                  type="button"
                  (click)="consoleLog = []"
                  class="text-xs font-medium text-[var(--color-stone-500)] hover:text-[var(--color-stone-700)] transition-colors cursor-pointer bg-transparent border-0"
                >
                  Clear
                </button>
              </div>
              <div
                class="h-36 overflow-y-auto rounded-xl bg-[var(--color-stone-900)] p-4 font-mono text-xs leading-relaxed"
              >
                @if (consoleLog.length === 0) {
                  <div class="text-[var(--color-stone-500)]">
                    Events will appear here as you interact...
                  </div>
                }
                @for (line of consoleLog; track $index) {
                  <div class="flex gap-2 mb-0.5">
                    <span class="text-[var(--color-stone-500)] shrink-0">{{
                      line.time
                    }}</span>
                    <span
                      class="shrink-0"
                      [class]="
                        line.type === 'otpComplete'
                          ? 'text-green-400'
                          : line.type === 'otpInvalid'
                            ? 'text-red-400'
                            : 'text-blue-400'
                      "
                      >{{ line.type }}</span
                    >
                    <span class="text-[var(--color-stone-300)] truncate">{{
                      line.payload
                    }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PlaygroundComponent {
  @ViewChild('playgroundOtp') playgroundOtp?: NgxOtpInputComponent;

  otpControl = new FormControl('', { nonNullable: true });
  isComplete = false;
  codeCopied = false;

  statuses: OtpStatus[] = ['idle', 'success', 'error'];

  patterns: Record<string, RegExp> = {
    numeric: /^\d$/,
    alpha: /^[a-zA-Z]$/,
    alphanumeric: /^[a-zA-Z0-9]$/,
  };

  selectedPattern = 'numeric';
  currentPattern: RegExp = this.patterns['numeric'];

  config = {
    length: 6,
    autoFocus: true,
    autoBlur: true,
    mask: false,
    inputMode: 'numeric',
    ariaLabel: 'One Time Password',
    status: 'idle' as OtpStatus,
    disabled: false,
  };

  consoleLog: { time: string; type: string; payload: string }[] = [];

  get generatedCode(): string {
    const attrs: string[] = [];
    attrs.push(`formControlName="otp"`);
    if (this.config.length !== 6)
      attrs.push(`[length]="${this.config.length}"`);
    if (!this.config.autoFocus) attrs.push(`[autoFocus]="false"`);
    if (!this.config.autoBlur) attrs.push(`[autoBlur]="false"`);
    if (this.config.mask) attrs.push(`[mask]="true"`);
    if (this.selectedPattern !== 'numeric') {
      const patternStr =
        this.selectedPattern === 'alpha' ? '/^[a-zA-Z]$/' : '/^[a-zA-Z0-9]$/';
      attrs.push(`[charPattern]="${patternStr}"`);
    }
    if (this.config.inputMode !== 'numeric')
      attrs.push(`inputMode="${this.config.inputMode}"`);
    if (this.config.ariaLabel !== 'One Time Password')
      attrs.push(`ariaLabel="${this.config.ariaLabel}"`);
    if (this.config.status !== 'idle')
      attrs.push(`[status]="'${this.config.status}'"`);

    const indent = '\n  ';
    return `<ngx-otp-input${indent}${attrs.join(indent)}\n></ngx-otp-input>`;
  }

  onPatternChange(): void {
    this.currentPattern =
      this.patterns[this.selectedPattern] ?? this.patterns['numeric'];
    this.rebuildComponent();
  }

  toggleDisabled(): void {
    if (this.config.disabled) {
      this.otpControl.disable();
    } else {
      this.otpControl.enable();
    }
  }

  resetPlayground(): void {
    this.config = {
      length: 6,
      autoFocus: true,
      autoBlur: true,
      mask: false,
      inputMode: 'numeric',
      ariaLabel: 'One Time Password',
      status: 'idle',
      disabled: false,
    };
    this.selectedPattern = 'numeric';
    this.currentPattern = this.patterns['numeric'];
    this.otpControl.enable();
    this.otpControl.reset();
    this.consoleLog = [];
    this.isComplete = false;
    this.rebuildComponent();
  }

  onLengthChange(value: number | string): void {
    const nextValue = Number(value);
    if (Number.isFinite(nextValue)) {
      this.config.length = nextValue;
    } else {
      this.config.length = 6;
    }
    this.otpControl.reset();
    this.isComplete = false;
  }

  rebuildComponent(): void {
    this.otpControl.reset();
    this.isComplete = false;
  }

  copyCode(): void {
    navigator.clipboard.writeText(this.generatedCode).then(() => {
      this.codeCopied = true;
      setTimeout(() => (this.codeCopied = false), 2000);
    });
  }

  onOtpChange(event: OtpChangeEvent): void {
    this.isComplete = event.isComplete;
    this.addLog('otpChange', JSON.stringify(event));
  }

  onOtpComplete(value: string): void {
    this.addLog('otpComplete', `"${value}"`);
  }

  onOtpInvalid(event: OtpInvalidEvent): void {
    this.addLog('otpInvalid', JSON.stringify(event));
  }

  private addLog(type: string, payload: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.consoleLog = [{ time, type, payload }, ...this.consoleLog].slice(
      0,
      30,
    );
  }
}
