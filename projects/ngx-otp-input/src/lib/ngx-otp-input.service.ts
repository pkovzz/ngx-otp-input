import { Injectable } from '@angular/core';

@Injectable()
export class NgxOtpInputService {
  init2DArray(size: number): string[][] {
    return new Array<string[]>(size).fill(new Array<string>());
  }

  toArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }

  addItemToAll(source: string[][], items: string[]): string[][] {
    if (source?.length > 0) {
      return source.map((entry) => entry.concat(items));
    }
  }

  removeItemFromAll(source: string[][], items: string[]): string[][] {
    if (source?.length > 0) {
      return source.map((entry) => entry.filter((item) => !items.includes(item)));
    }
  }

  addItemAtIndex(
    source: string[][],
    index: number,
    items: string[]
  ): string[][] {
    if (source?.length > 0) {
      source[index] = source[index].concat(items);
      return source;
    }
  }

  removeItemAtIndex(
    source: string[][],
    index: number,
    items: string[]
  ): string[][] {
    if (source?.length > 0) {
      source[index] = source[index].filter((item) => !items.includes(item));
      return source;
    }
  }
}
