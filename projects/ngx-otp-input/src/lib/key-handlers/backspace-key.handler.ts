import { KeyHandler, KeyHandlerContext } from './key-handler';

export class BackspaceKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'Backspace';
  }

  handle(event: KeyboardEvent, context: KeyHandlerContext): void {
    event.preventDefault();

    const { selectionStart, selectionEnd } = context;

    if (selectionEnd > selectionStart) {
      const newValue =
        context.value.slice(0, selectionStart) +
        context.value.slice(selectionEnd);
      context.setValueFromUser(newValue);
      context.syncNativeInputValue();
      context.setCaretIndex(selectionStart);
      return;
    }

    if (selectionStart > 0) {
      const nextValue =
        context.value.slice(0, selectionStart - 1) +
        context.value.slice(selectionStart);
      context.setValueFromUser(nextValue);
      context.syncNativeInputValue();
      context.setCaretIndex(selectionStart - 1);
    }
  }
}
