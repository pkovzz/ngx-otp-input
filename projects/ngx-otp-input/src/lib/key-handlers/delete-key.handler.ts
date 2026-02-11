import { KeyHandler, KeyHandlerContext } from './key-handler';

export class DeleteKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'Delete';
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

    if (selectionStart < context.value.length) {
      const nextValue =
        context.value.slice(0, selectionStart) +
        context.value.slice(selectionStart + 1);
      context.setValueFromUser(nextValue);
      context.syncNativeInputValue();
      context.setCaretIndex(selectionStart);
    }
  }
}
