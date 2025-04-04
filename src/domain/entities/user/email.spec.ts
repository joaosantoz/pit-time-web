import { Email } from '@domain/entities/user/email';
import { EmailLength } from '@domain/enums/email-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';

describe('Email', () => {
  describe('create()', () => {
    it('should create instance with valid email "user@example.com"', () => {
      const email = Email.create('user@example.com');
      expect(email).toBeInstanceOf(Email);
      expect(email.getValue()).toBe('user@example.com');
    });

    it('should throw for empty email', () => {
      expect(() => Email.create('')).toThrowError(DomainValidationError);
    });

    it('should throw for email containing whitespaces', () => {
      expect(() => Email.create(' user@example.com')).toThrowError(DomainValidationError);
    });

    it('should throw for whitespace-only email', () => {
      expect(() => Email.create('   ')).toThrowError(DomainValidationError);
    });

    it('should throw for email missing local part ("@example.com")', () => {
      expect(() => Email.create('@example.com')).toThrowError(DomainValidationError);
    });

    it('should throw for email missing domain ("user@")', () => {
      expect(() => Email.create('user@')).toThrowError(DomainValidationError);
    });

    it('should throw for email with double dots ("user@example..com")', () => {
      expect(() => Email.create('user@example..com')).toThrowError(DomainValidationError);
    });

    it('should throw for email with invalid domain ("user@.com")', () => {
      expect(() => Email.create('user@.com')).toThrowError(DomainValidationError);
    });

    it(`should throw for email with less than ${EmailLength.MIN} characters`, () => {
      const shortAndInvalidEmail = 'a@b.';
      expect(() => Email.create(shortAndInvalidEmail)).toThrowError(DomainValidationError);
    });

    it(`should throw for email with more than ${EmailLength.MAX} characters`, () => {
      const longEmail = 'a'.repeat(EmailLength.MAX / 2) + '@' + 'b'.repeat(EmailLength.MAX / 2) + '.c';
      expect(() => Email.create(longEmail)).toThrowError(DomainValidationError);
    });
  });

  describe('valid formats', () => {
    it('should accept email with dot in local part ("firstname.lastname@example.com")', () => {
      expect(() => Email.create('firstname.lastname@example.com')).not.toThrowError();
    });

    it('should accept email with plus tag ("user+tag@example.com")', () => {
      expect(() => Email.create('user+tag@example.com')).not.toThrowError();
    });

    it('should accept email with subdomain ("user@sub.domain.com")', () => {
      expect(() => Email.create('user@sub.domain.com')).not.toThrowError();
    });

    it('should accept email with country code TLD ("user@domain.com.br")', () => {
      expect(() => Email.create('user@domain.com.br')).not.toThrowError();
    });

    it('should accept numeric local part ("123456@example.com")', () => {
      expect(() => Email.create('123456@example.com')).not.toThrowError();
    });

    it('should accept new TLDs ("user@example.io")', () => {
      expect(() => Email.create('user@example.io')).not.toThrowError();
    });

    it('should accept hyphen in local part ("firstname-lastname@example.com")', () => {
      expect(() => Email.create('firstname-lastname@example.com')).not.toThrowError();
    });
  });

  describe('getValue()', () => {
    it('should return original email value', () => {
      const email = Email.create('test@domain.com');
      expect(email.getValue()).toBe('test@domain.com');
    });
  });

  describe('boundary cases', () => {
    it('should accept email with minimum valid length ("a@b.c")', () => {
      expect(() => Email.create('a@b.c')).not.toThrowError();
    });

    it('should accept email with multiple subdomains ("user@a.b.c.d.com")', () => {
      expect(() => Email.create('user@a.b.c.d.com')).not.toThrowError();
    });
  });
});
