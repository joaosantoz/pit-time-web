import { Name } from '@domain/entities/user/name';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { NameLength } from '@domain/enums/name-length.enum';
import { createDomainExceptionMatcher } from '../../../main/utils/testing/domain-exception-matcher.util';

describe('Name', () => {
  describe('create()', () => {
    it('should create instance with valid name "John Doe"', () => {
      const name = Name.create('John Doe');
      expect(name).toBeInstanceOf(Name);
      expect(name.getValue()).toBe('John Doe');
    });

    it('should throw for empty name', () => {
      expect(() => Name.create('')).toThrowMatching(createDomainExceptionMatcher('Name cannot be empty.', ExceptionCode.INVALID_NAME));
    });

    it('should throw for whitespace-only name', () => {
      expect(() => Name.create('   ')).toThrowMatching(createDomainExceptionMatcher('Name cannot be empty.', ExceptionCode.INVALID_NAME));
    });

    it(`should throw for name shorter than ${NameLength.MIN} characters`, () => {
      const shortName = 'A'.repeat(NameLength.MIN - 1);
      expect(() => Name.create(shortName)).toThrowMatching(
        createDomainExceptionMatcher(`Name must be at least ${NameLength.MIN} characters.`, ExceptionCode.INVALID_NAME)
      );
    });

    it(`should throw for name longer than ${NameLength.MAX} characters`, () => {
      const longName = 'A'.repeat(NameLength.MAX + 1);
      expect(() => Name.create(longName)).toThrowMatching(
        createDomainExceptionMatcher(`Name must be at most ${NameLength.MAX} characters.`, ExceptionCode.INVALID_NAME)
      );
    });
  });

  describe('boundary cases', () => {
    it(`should accept name with exactly ${NameLength.MIN} chars`, () => {
      const minLengthName = 'A'.repeat(NameLength.MIN);
      expect(() => Name.create(minLengthName)).not.toThrow();
    });

    it(`should accept name with exactly ${NameLength.MAX} chars`, () => {
      const maxLengthName = 'A'.repeat(NameLength.MAX);
      expect(() => Name.create(maxLengthName)).not.toThrow();
    });
  });

  describe('getValue()', () => {
    it('should return original name value', () => {
      const rawName = 'Jane Smith';
      const name = Name.create(rawName);
      expect(name.getValue()).toBe(rawName);
    });

    it('should preserve whitespace between words', () => {
      const nameWithSpaces = '  Jane   Smith  ';
      const name = Name.create(nameWithSpaces.trim());
      expect(name.getValue()).toBe('Jane   Smith');
    });
  });
});
