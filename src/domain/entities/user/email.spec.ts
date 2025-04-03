import { Email } from '@domain/entities/user/email';
import { DomainException } from '@domain/exceptions/domain-exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';

describe('Email', () => {
  it('should create an Email instance with a valid email', () => {
    const validEmail = 'user@example.com';
    const email: Email = Email.create(validEmail);

    expect(email).toBeInstanceOf(Email);
    expect(email.getValue()).toBe(validEmail);
  });

  it('should throw DomainException for invalid email format', () => {
    const testCases = [
      { email: 'user@.com', expectedMessage: 'Invalid Email.' },
      { email: '@example.com', expectedMessage: 'Invalid Email.' },
      { email: 'user@example', expectedMessage: 'Invalid Email.' },
      { email: 'user@example..com', expectedMessage: 'Invalid Email.' },
      { email: ' ', expectedMessage: 'Email cannot be empty.' },
      { email: '', expectedMessage: 'Email cannot be empty.' }
    ];

    testCases.forEach(({ email, expectedMessage }) => {
      expect(() => Email.create(email)).toThrowMatching((error) => {
        return error instanceof DomainException && error.code === ExceptionCode.INVALID_EMAIL && error.message === expectedMessage;
      });
    });
  });

  it('should accept valid email formats', () => {
    const testCases = [
      'user@example.com',
      'firstname.lastname@example.com',
      'user+tag@example.com',
      'user@sub.domain.com',
      'user@domain.com.br',
      '123456@example.com',
      'user@example.io',
      'firstname-lastname@example.com'
    ];

    testCases.forEach((email) => {
      expect(() => {
        const emailInstance = Email.create(email);
        expect(emailInstance.getValue()).toBe(email.trim());
      }).not.toThrow();
    });
  });

  it('should return the raw email value via getValue()', () => {
    const validEmail = 'test@domain.com';
    const email: Email = Email.create(validEmail);

    expect(email.getValue()).toBe(validEmail);
  });
});
