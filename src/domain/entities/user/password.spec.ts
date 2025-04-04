import { Password } from './password';
import { PasswordLength } from '@domain/enums/password-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';

describe('Password', () => {
  describe('create()', () => {
    it('should create instance with valid password "Valid1@Password"', () => {
      const password = Password.create('Valid1@Password');
      expect(password).toBeInstanceOf(Password);
      expect(password.getValue()).toBe('Valid1@Password');
    });

    it('should throw for empty password', () => {
      expect(() => Password.create('')).toThrowError(DomainValidationError);
    });

    it('should throw for passwords containing whitespace', () => {
      expect(() => Password.create(' Valid1@Password')).toThrowError(DomainValidationError);
    });

    it('should throw for whitespace-only password', () => {
      expect(() => Password.create('   ')).toThrowError(DomainValidationError);
    });

    it(`should throw for password shorter than ${PasswordLength.MIN} characters`, () => {
      expect(() => Password.create('A1@b')).toThrowError(DomainValidationError);
    });

    it(`should throw for password longer than ${PasswordLength.MAX} characters`, () => {
      expect(() => Password.create('A1@' + 'a'.repeat(PasswordLength.MAX))).toThrowError(DomainValidationError);
    });

    it('should throw for password without lowercase', () => {
      expect(() => Password.create('UPPER1@')).toThrowError(DomainValidationError);
    });

    it('should throw for password without uppercase', () => {
      expect(() => Password.create('lower1@')).toThrowError(DomainValidationError);
    });

    it('should throw for password without digit', () => {
      expect(() => Password.create('NoDigit@')).toThrowError(DomainValidationError);
    });

    it('should throw for password without special char', () => {
      expect(() => Password.create('NoSpecial1')).toThrowError(DomainValidationError);
    });

    it('should throw for password with spaces', () => {
      expect(() => Password.create('Has Space1@')).toThrowError(DomainValidationError);
    });
  });

  describe('compare()', () => {
    let password: Password;

    beforeEach(() => {
      password = Password.create('Valid1@Password');
    });

    it('should return true for matching password', () => {
      expect(password.compare('Valid1@Password')).toBe(true);
    });

    it('should return false for different password', () => {
      expect(password.compare('Invalid1@')).toBe(false);
    });

    it('should be case sensitive', () => {
      expect(password.compare('valid1@password')).toBe(false);
    });
  });

  describe('getValue()', () => {
    it('should return original password', () => {
      const password = Password.create('Valid1@Password');
      expect(password.getValue()).toBe('Valid1@Password');
    });
  });

  describe('boundary cases', () => {
    it('should accept password with exactly 6 chars', () => {
      expect(() => Password.create('A1@abC')).not.toThrowError();
    });

    it('should accept password with exactly 20 chars', () => {
      const pass = 'A' + 'a'.repeat(15) + '1@';
      expect(() => Password.create(pass)).not.toThrowError();
    });

    it('should accept all special chars (!@#$%^&*)', () => {
      const specialChars = '!@#$%^&*';
      specialChars.split('').forEach((char) => {
        expect(() => Password.create(`A1${char}aBc23`)).not.toThrowError();
      });
    });
  });
});
