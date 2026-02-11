import { KeyHandler, KeyHandlerContext } from './key-handler';

export class BackspaceKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'Backspace';
  }

  handle(event: KeyboardEvent, context: KeyHandlerContext): void {
    event.preventDefault();

    if (context.selectionStart > 0) {
      const nextValue =
        context.value.slice(0, context.selectionStart - 1) +
        context.value.slice(context.selectionStart);
      context.setValueFromUser(nextValue);
      context.syncNativeInputValue();
      context.setCaretIndex(context.selectionStart - 1);
    }
  }
}
