import { KeyHandler, KeyHandlerContext } from './key-handler';

export class PrintableKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    );
  }

  handle(event: KeyboardEvent, context: KeyHandlerContext): void {
    event.preventDefault();

    if (!context.isCharAllowed(event.key)) {
      context.setInvalidState('char-rejected', event.key);
      return;
    }

    const start = Math.min(context.selectionStart, context.selectionEnd);
    const end = Math.max(context.selectionStart, context.selectionEnd);
    let nextValue = context.value;

    if (start < context.value.length) {
      nextValue =
        context.value.slice(0, start) +
        event.key +
        context.value.slice(
          Math.min(end + (start === end ? 1 : 0), context.value.length),
        );
    } else if (context.value.length < context.resolvedLength) {
      nextValue = context.value + event.key;
    }

    const sanitized = context.sanitize(nextValue);
    context.applySanitizedResult(sanitized, () => start + 1);
  }
}
