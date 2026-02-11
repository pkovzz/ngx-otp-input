import { KeyHandler } from './key-handler';

export class EnterKeyHandler implements KeyHandler {
  canHandle(event: KeyboardEvent): boolean {
    return event.key === 'Enter';
  }

  handle(event: KeyboardEvent): void {
    event.preventDefault();
  }
}
