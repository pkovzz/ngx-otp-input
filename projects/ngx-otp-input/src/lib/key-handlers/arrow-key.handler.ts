import { KeyHandler, KeyHandlerContext } from './key-handler';

export class ArrowKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'ArrowLeft' || event.key === 'ArrowRight';
  }

  handle(event: KeyboardEvent, context: KeyHandlerContext): void {
    event.preventDefault();

    if (event.key === 'ArrowLeft') {
      context.setCaretIndex(context.selectionStart - 1);
      return;
    }

    context.setCaretIndex(context.selectionStart + 1);
  }
}
