import { DomainException } from '@domain/exceptions/domain-exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';

export class Email {
  static VALIDATION_REGEX: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    Email.validateInput(email);

    return new Email(email);
  }

  private static validateInput(email: string): void {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || trimmedEmail.length === 0) {
      throw new DomainException('Email cannot be empty.', ExceptionCode.INVALID_EMAIL);
    }

    if (!Email.VALIDATION_REGEX.test(trimmedEmail)) {
      throw new DomainException('Invalid Email.', ExceptionCode.INVALID_EMAIL);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
