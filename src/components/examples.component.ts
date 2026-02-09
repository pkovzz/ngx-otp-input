import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NgxOtpInputComponent,
  OtpChangeEvent,
  OtpInvalidEvent,
  OtpStatus,
} from 'ngx-otp-input';

interface EventLogEntry {
  time: string;
  type: 'valueChange' | 'valueComplete' | 'valueInvalid';
  payload: string;
}

@Component({
  standalone: true,
  selector: 'app-examples',
  imports: [CommonModule, ReactiveFormsModule, NgxOtpInputComponent],
  template: `
    <section
      id="examples"
      class="py-20"
    >
      <div class="section-container">
        <div class="text-center mb-14">
          <h2
            class="text-3xl md:text-4xl font-heading font-700 tracking-tight text-[var(--color-stone-900)]"
          >
            Live Examples
          </h2>
          <p
            class="mt-3 text-[var(--color-stone-500)] text-lg max-w-xl mx-auto"
          >
            See every feature in action. Each example is a self-contained demo
            with its own form control.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 1. Default numeric -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Default (6-digit numeric)</h3>
              <p class="example-card-desc">
                The default configuration — 6 boxes, numeric input only.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                [formControl]="defaultOtp"
                [length]="6"
                [autoFocus]="false"
              ></ngx-otp-input>
            </div>
            <div class="example-card-code">
              <code>&lt;ngx-otp-input [length]="6"&gt;</code>
            </div>
          </div>

          <!-- 2. 4-digit PIN masked -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Masked PIN (4-digit)</h3>
              <p class="example-card-desc">
                Hidden input for sensitive codes. Uses
                <span class="code-inline">mask</span> to show dots.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                [formControl]="maskedOtp"
                [length]="4"
                [mask]="true"
                [autoFocus]="false"
              ></ngx-otp-input>
            </div>
            <div class="example-card-code">
              <code>&lt;ngx-otp-input [length]="4" [mask]="true"&gt;</code>
            </div>
          </div>

          <!-- 3. Alphanumeric -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Alphanumeric</h3>
              <p class="example-card-desc">
                Accepts letters and digits via custom
                <span class="code-inline">charPattern</span>.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                [formControl]="alphaOtp"
                [length]="5"
                [charPattern]="alphaPattern"
                inputMode="text"
                [autoFocus]="false"
              ></ngx-otp-input>
            </div>
            <div class="example-card-code">
              <code
                >&lt;ngx-otp-input [charPattern]="/^[a-zA-Z0-9]$/"
                inputMode="text"&gt;</code
              >
            </div>
          </div>

          <!-- 4. Status states -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Status States</h3>
              <p class="example-card-desc">
                Toggle between
                <span class="code-inline">idle</span>,
                <span class="code-inline">success</span>, and
                <span class="code-inline">error</span>.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                [formControl]="statusOtp"
                [length]="6"
                [status]="currentStatus"
                [autoFocus]="false"
              ></ngx-otp-input>
              <div class="flex gap-2 mt-4">
                @for (s of statuses; track s) {
                  <button
                    type="button"
                    (click)="currentStatus = s"
                    class="px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-all"
                    [class]="
                      currentStatus === s
                        ? 'bg-[var(--color-stone-900)] text-white border-[var(--color-stone-900)]'
                        : 'bg-white text-[var(--color-stone-600)] border-[var(--color-stone-200)] hover:bg-[var(--color-stone-50)]'
                    "
                  >
                    {{ s }}
                  </button>
                }
              </div>
            </div>
            <div class="example-card-code">
              <code
                >&lt;ngx-otp-input [status]="'{{ currentStatus }}'"&gt;</code
              >
            </div>
          </div>

          <!-- 5. Disabled -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Disabled State</h3>
              <p class="example-card-desc">
                Disable the control programmatically via the reactive form API.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                [formControl]="disabledOtp"
                [length]="6"
                [autoFocus]="false"
              ></ngx-otp-input>
              <button
                type="button"
                (click)="toggleDisabled()"
                class="mt-4 px-4 py-1.5 text-xs font-semibold rounded-md border cursor-pointer transition-all bg-white text-[var(--color-stone-600)] border-[var(--color-stone-200)] hover:bg-[var(--color-stone-50)]"
              >
                {{ disabledOtp.disabled ? 'Enable' : 'Disable' }}
              </button>
            </div>
            <div class="example-card-code">
              <code>this.otpControl.disable();</code>
            </div>
          </div>

          <!-- 6. Event log -->
          <div class="example-card">
            <div class="example-card-header">
              <h3 class="example-card-title">Event Log</h3>
              <p class="example-card-desc">
                Watch
                <span class="code-inline">(valueChange)</span>,
                <span class="code-inline">(valueComplete)</span>, and
                <span class="code-inline">(valueInvalid)</span> events fire
                live.
              </p>
            </div>
            <div class="example-card-demo">
              <ngx-otp-input
                #eventOtpInput
                [formControl]="eventOtp"
                [length]="4"
                [autoFocus]="false"
                (valueChange)="onEventChange($event)"
                (valueComplete)="onEventComplete($event)"
                (valueInvalid)="onEventInvalid($event)"
              ></ngx-otp-input>
              <div
                class="mt-4 w-full max-h-32 overflow-y-auto rounded-lg bg-[var(--color-stone-900)] p-3 font-mono text-xs leading-relaxed"
              >
                @if (eventLog.length === 0) {
                  <div class="text-[var(--color-stone-500)]">
                    Waiting for events...
                  </div>
                }
                @for (entry of eventLog; track $index) {
                  <div class="flex gap-2 mb-0.5">
                    <span class="text-[var(--color-stone-500)] shrink-0">{{
                      entry.time
                    }}</span>
                    <span
                      class="shrink-0"
                      [class]="
                        entry.type === 'valueComplete'
                          ? 'text-green-400'
                          : entry.type === 'valueInvalid'
                            ? 'text-red-400'
                            : 'text-blue-400'
                      "
                      >{{ entry.type }}</span
                    >
                    <span class="text-[var(--color-stone-300)] truncate">{{
                      entry.payload
                    }}</span>
                  </div>
                }
              </div>
              <button
                type="button"
                (click)="clearEventLog()"
                class="mt-2 px-3 py-1 text-xs font-medium rounded-md border cursor-pointer transition-all bg-white text-[var(--color-stone-600)] border-[var(--color-stone-200)] hover:bg-[var(--color-stone-50)]"
              >
                Clear log
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .example-card {
        display: flex;
        flex-direction: column;
        border-radius: var(--radius-xl);
        border: 1px solid var(--color-stone-200);
        background: white;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
      }

      .example-card:hover {
        box-shadow: var(--shadow-lg);
      }

      .example-card-header {
        padding: 1.25rem 1.5rem 0;
      }

      .example-card-title {
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: 1rem;
        color: var(--color-stone-900);
        margin: 0 0 0.25rem;
      }

      .example-card-desc {
        font-size: 0.875rem;
        color: var(--color-stone-500);
        margin: 0;
        line-height: 1.5;
      }

      .example-card-demo {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }

      .example-card-code {
        padding: 0.75rem 1.5rem;
        background: var(--color-stone-50);
        border-top: 1px solid var(--color-stone-100);
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--color-stone-500);
        overflow-x: auto;
      }
    `,
  ],
})
export class ExamplesComponent {
  @ViewChild('eventOtpInput') eventOtpInput?: NgxOtpInputComponent;

  defaultOtp = new FormControl('', { nonNullable: true });
  maskedOtp = new FormControl('', { nonNullable: true });
  alphaOtp = new FormControl('', { nonNullable: true });
  statusOtp = new FormControl('123456', { nonNullable: true });
  disabledOtp = new FormControl('', { nonNullable: true });
  eventOtp = new FormControl('', { nonNullable: true });

  alphaPattern = /^[a-zA-Z0-9]$/;
  statuses: OtpStatus[] = ['idle', 'success', 'error'];
  currentStatus: OtpStatus = 'idle';
  eventLog: EventLogEntry[] = [];

  toggleDisabled(): void {
    if (this.disabledOtp.disabled) {
      this.disabledOtp.enable();
    } else {
      this.disabledOtp.disable();
    }
  }

  onEventChange(event: OtpChangeEvent): void {
    this.addLog('valueChange', JSON.stringify(event));
  }

  onEventComplete(value: string): void {
    this.addLog('valueComplete', `"${value}"`);
  }

  onEventInvalid(event: OtpInvalidEvent): void {
    this.addLog('valueInvalid', JSON.stringify(event));
  }

  clearEventLog(): void {
    this.eventLog = [];
    this.eventOtp.reset();
  }

  private addLog(type: EventLogEntry['type'], payload: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.eventLog = [{ time, type, payload }, ...this.eventLog].slice(0, 20);
  }
}
