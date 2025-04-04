import { Name } from '@domain/entities/user/name';
import { NameLength } from '@domain/enums/name-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';

describe('Name', () => {
  describe('create()', () => {
    it('should create instance with valid name "John Doe"', () => {
      const name = Name.create('John Doe');
      expect(name).toBeInstanceOf(Name);
      expect(name.getValue()).toBe('John Doe');
    });

    it('should throw for empty name', () => {
      expect(() => Name.create('')).toThrowError(DomainValidationError);
    });

    it('should throw for whitespace-only name', () => {
      expect(() => Name.create('   ')).toThrowError(DomainValidationError);
    });

    it(`should throw for name shorter than ${NameLength.MIN} characters`, () => {
      const shortName = 'A'.repeat(NameLength.MIN - 1);
      expect(() => Name.create(shortName)).toThrowError(DomainValidationError);
    });

    it(`should throw for name longer than ${NameLength.MAX} characters`, () => {
      const longName = 'A'.repeat(NameLength.MAX + 1);
      expect(() => Name.create(longName)).toThrowError(DomainValidationError);
    });
  });

  describe('boundary cases', () => {
    it(`should accept name with exactly ${NameLength.MIN} chars`, () => {
      const minLengthName = 'A'.repeat(NameLength.MIN);
      expect(() => Name.create(minLengthName)).not.toThrowError();
    });

    it(`should accept name with exactly ${NameLength.MAX} chars`, () => {
      const maxLengthName = 'A'.repeat(NameLength.MAX);
      expect(() => Name.create(maxLengthName)).not.toThrowError();
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
