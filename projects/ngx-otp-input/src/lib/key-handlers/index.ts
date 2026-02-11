export { KeyHandler, KeyHandlerContext } from './key-handler';
export { PrintableKeyHandler } from './printable-key.handler';
export { ArrowKeyHandler } from './arrow-key.handler';
export { BackspaceKeyHandler } from './backspace-key.handler';
export { DeleteKeyHandler } from './delete-key.handler';
export { EnterKeyHandler } from './enter-key.handler';

import { KeyHandler } from './key-handler';
import { PrintableKeyHandler } from './printable-key.handler';
import { ArrowKeyHandler } from './arrow-key.handler';
import { BackspaceKeyHandler } from './backspace-key.handler';
import { DeleteKeyHandler } from './delete-key.handler';
import { EnterKeyHandler } from './enter-key.handler';

export function createDefaultKeyHandlers(): KeyHandler[] {
  return [
    new PrintableKeyHandler(),
    new ArrowKeyHandler(),
    new BackspaceKeyHandler(),
    new DeleteKeyHandler(),
    new EnterKeyHandler(),
  ];
}
