import { Password } from './password';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { createDomainExceptionMatcher } from '../../../main/utils/testing/domain-exception-matcher.util';
import { PasswordLength } from '@domain/enums/password-length.enum';

describe('Password', () => {
  describe('create()', () => {
    it('should create instance with valid password "Valid1@Password"', () => {
      const password = Password.create('Valid1@Password');
      expect(password).toBeInstanceOf(Password);
      expect(password.getValue()).toBe('Valid1@Password');
    });

    it('should throw for empty password', () => {
      expect(() => Password.create('')).toThrowMatching(createDomainExceptionMatcher('Password cannot be empty.', ExceptionCode.INVALID_PASSWORD));
    });

    it('should throw for passwords containing whitespace', () => {
      expect(() => Password.create(' Valid1@Password')).toThrowMatching(
        createDomainExceptionMatcher('Password cannot contain spaces.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for whitespace-only password', () => {
      expect(() => Password.create('   ')).toThrowMatching(
        createDomainExceptionMatcher('Password cannot contain spaces.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it(`should throw for password shorter than ${PasswordLength.MIN} characters`, () => {
      expect(() => Password.create('A1@b')).toThrowMatching(
        createDomainExceptionMatcher(`Password must be at least ${PasswordLength.MIN} characters.`, ExceptionCode.INVALID_PASSWORD)
      );
    });

    it(`should throw for password longer than ${PasswordLength.MAX} characters`, () => {
      expect(() => Password.create('A1@' + 'a'.repeat(PasswordLength.MAX))).toThrowMatching(
        createDomainExceptionMatcher(`Password must be at most ${PasswordLength.MAX} characters.`, ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for password without lowercase', () => {
      expect(() => Password.create('UPPER1@')).toThrowMatching(
        createDomainExceptionMatcher('Password must contain at least one lowercase letter.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for password without uppercase', () => {
      expect(() => Password.create('lower1@')).toThrowMatching(
        createDomainExceptionMatcher('Password must contain at least one uppercase letter.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for password without digit', () => {
      expect(() => Password.create('NoDigit@')).toThrowMatching(
        createDomainExceptionMatcher('Password must contain at least one digit.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for password without special char', () => {
      expect(() => Password.create('NoSpecial1')).toThrowMatching(
        createDomainExceptionMatcher('Password must contain at least one special character.', ExceptionCode.INVALID_PASSWORD)
      );
    });

    it('should throw for password with spaces', () => {
      expect(() => Password.create('Has Space1@')).toThrowMatching(
        createDomainExceptionMatcher('Password cannot contain spaces.', ExceptionCode.INVALID_PASSWORD)
      );
    });
  });

  describe('compare()', () => {
    let password: Password;

    beforeEach(() => {
      password = Password.create('Valid1@Password');
    });

    it('should return true for matching password', () => {
      expect(password.compare('Valid1@Password')).toBeTrue();
    });

    it('should return false for different password', () => {
      expect(password.compare('Invalid1@')).toBeFalse();
    });

    it('should be case sensitive', () => {
      expect(password.compare('valid1@password')).toBeFalse();
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
      expect(() => Password.create('A1@abC')).not.toThrow();
    });

    it('should accept password with exactly 20 chars', () => {
      const pass = 'A' + 'a'.repeat(15) + '1@';
      expect(() => Password.create(pass)).not.toThrow();
    });

    it('should accept all special chars (!@#$%^&*)', () => {
      const specialChars = '!@#$%^&*';
      specialChars.split('').forEach((char) => {
        expect(() => Password.create(`A1${char}aBc23`)).not.toThrow();
      });
    });
  });
});
