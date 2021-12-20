import { TestBed } from '@angular/core/testing';
import { NgxOtpInputService } from './ngx-otp-input.service';

describe('ngx-otp-input service', () => {
  const OTP_LENGTH = 4;
  const source = [
    ['a', 'b', 'c'],
    ['a', 'b'],
  ];

  let service: NgxOtpInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NgxOtpInputService] });
    service = TestBed.inject(NgxOtpInputService);
  });

  it('should init styles array', () => {
    const stylesInit = service.init2DArray(OTP_LENGTH);
    expect(stylesInit.length).toEqual(OTP_LENGTH);
  });

  it('should return the same array', () => {
    const styles = ['a', 'b'];
    const result = service.toArray(styles);
    expect(result).toEqual(styles);
  });

  it('should return a new array containing the given string', () => {
    const styles = 'c';
    const result = service.toArray(styles);
    expect(result).toEqual([styles]);
  });

  it('should fill the source with the given values', () => {
    const newValues = ['q', 'w'];
    const result = service.addItemToAll(source, newValues);

    for (const value of newValues) {
      for (const entry of result) {
        expect(entry.includes(value)).toBeTrue();
      }
    }
  });

  it('should remove the given values from the source', () => {
    const removeThese = ['c', 'b'];
    const result = service.removeItemFromAll(source, removeThese);

    for (const value of removeThese) {
      for (const entry of result) {
        expect(entry.includes(value)).toBeFalse();
      }
    }
  });

  it('should add values at the given index', () => {
    const newValues = ['q', 'w'];
    const index = 1;
    const result = service.addItemAtIndex(source, index, newValues);

    for (const value of newValues) {
      expect(result[index].includes(value)).toBeTrue();
    }
  });

  it('should remove values at the given index', () => {
    const removeThese = ['c', 'b'];
    const index = 0;
    const result = service.removeItemAtIndex(source, index, removeThese);

    for (const value of removeThese) {
      expect(result[index].includes(value)).toBeFalse();
    }
  });
});
