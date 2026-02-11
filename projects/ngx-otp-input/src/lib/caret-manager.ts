export class CaretManager {
  syncNativeValue(input: HTMLInputElement | undefined, value: string): void {
    if (input && input.value !== value) {
      input.value = value;
    }
  }

  setCaretPosition(
    input: HTMLInputElement | undefined,
    index: number,
    maxIndex: number,
  ): number {
    const clamped = Math.min(Math.max(0, index), maxIndex);

    if (input) {
      try {
        input.setSelectionRange(clamped, clamped);
      } catch {
        // Ignore selection errors for unsupported input types.
      }
    }

    return clamped;
  }

  selectAll(input: HTMLInputElement | undefined): void {
    try {
      input?.setSelectionRange(0, input.value.length);
    } catch {
      // Ignore selection errors for unsupported input types.
    }
  }
}
