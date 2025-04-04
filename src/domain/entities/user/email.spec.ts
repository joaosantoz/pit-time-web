import { Email } from '@domain/entities/user/email';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { createDomainExceptionMatcher } from '../../../main/utils/testing/domain-exception-matcher.util';
import { EmailLength } from '@domain/enums/email-length.enum';

describe('Email', () => {
  describe('create()', () => {
    it('should create instance with valid email "user@example.com"', () => {
      const email = Email.create('user@example.com');
      expect(email).toBeInstanceOf(Email);
      expect(email.getValue()).toBe('user@example.com');
    });

    it('should throw for empty email', () => {
      expect(() => Email.create('')).toThrowMatching(createDomainExceptionMatcher('Email cannot be empty.', ExceptionCode.INVALID_EMAIL));
    });

    it('should throw for whitespace-only email', () => {
      expect(() => Email.create('   ')).toThrowMatching(createDomainExceptionMatcher('Email cannot be empty.', ExceptionCode.INVALID_EMAIL));
    });

    it('should throw for email missing local part ("@example.com")', () => {
      expect(() => Email.create('@example.com')).toThrowMatching(createDomainExceptionMatcher('Invalid Email.', ExceptionCode.INVALID_EMAIL));
    });

    it('should throw for email missing domain ("user@")', () => {
      expect(() => Email.create('user@')).toThrowMatching(createDomainExceptionMatcher('Invalid Email.', ExceptionCode.INVALID_EMAIL));
    });

    it('should throw for email with double dots ("user@example..com")', () => {
      expect(() => Email.create('user@example..com')).toThrowMatching(createDomainExceptionMatcher('Invalid Email.', ExceptionCode.INVALID_EMAIL));
    });

    it('should throw for email with invalid domain ("user@.com")', () => {
      expect(() => Email.create('user@.com')).toThrowMatching(createDomainExceptionMatcher('Invalid Email.', ExceptionCode.INVALID_EMAIL));
    });

    it(`should throw for email with less than ${EmailLength.MIN} characters`, () => {
      const shortAndInvalidEmail = 'a@b.';

      expect(() => Email.create(shortAndInvalidEmail)).toThrowMatching(
        createDomainExceptionMatcher(`Email must be at least ${EmailLength.MIN} characters.`, ExceptionCode.INVALID_EMAIL)
      );
    });

    it(`should throw for email with more than ${EmailLength.MAX} characters`, () => {
      const longEmail = 'a'.repeat(EmailLength.MAX / 2) + '@' + 'b'.repeat(EmailLength.MAX / 2) + '.c';

      expect(() => Email.create(longEmail)).toThrowMatching(
        createDomainExceptionMatcher(`Email must be at most ${EmailLength.MAX} characters.`, ExceptionCode.INVALID_EMAIL)
      );
    });
  });

  describe('valid formats', () => {
    it('should accept email with dot in local part ("firstname.lastname@example.com")', () => {
      expect(() => Email.create('firstname.lastname@example.com')).not.toThrow();
    });

    it('should accept email with plus tag ("user+tag@example.com")', () => {
      expect(() => Email.create('user+tag@example.com')).not.toThrow();
    });

    it('should accept email with subdomain ("user@sub.domain.com")', () => {
      expect(() => Email.create('user@sub.domain.com')).not.toThrow();
    });

    it('should accept email with country code TLD ("user@domain.com.br")', () => {
      expect(() => Email.create('user@domain.com.br')).not.toThrow();
    });

    it('should accept numeric local part ("123456@example.com")', () => {
      expect(() => Email.create('123456@example.com')).not.toThrow();
    });

    it('should accept new TLDs ("user@example.io")', () => {
      expect(() => Email.create('user@example.io')).not.toThrow();
    });

    it('should accept hyphen in local part ("firstname-lastname@example.com")', () => {
      expect(() => Email.create('firstname-lastname@example.com')).not.toThrow();
    });
  });

  describe('getValue()', () => {
    it('should return original email value', () => {
      const email = Email.create('test@domain.com');
      expect(email.getValue()).toBe('test@domain.com');
    });

    it('should return trimmed value when created with spaces', () => {
      const email = Email.create('  test@domain.com  ');
      expect(email.getValue()).toBe('test@domain.com');
    });
  });

  describe('boundary cases', () => {
    it('should accept email with minimum valid length ("a@b.c")', () => {
      expect(() => Email.create('a@b.c')).not.toThrow();
    });

    it('should accept email with multiple subdomains ("user@a.b.c.d.com")', () => {
      expect(() => Email.create('user@a.b.c.d.com')).not.toThrow();
    });
  });
});
