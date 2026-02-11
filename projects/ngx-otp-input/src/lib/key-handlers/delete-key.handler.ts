import { KeyHandler, KeyHandlerContext } from './key-handler';

export class DeleteKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'Delete';
  }

  handle(event: KeyboardEvent, context: KeyHandlerContext): void {
    event.preventDefault();

    if (context.selectionStart < context.value.length) {
      const nextValue =
        context.value.slice(0, context.selectionStart) +
        context.value.slice(context.selectionStart + 1);
      context.setValueFromUser(nextValue);
      context.syncNativeInputValue();
      context.setCaretIndex(context.selectionStart);
    }
  }
}
