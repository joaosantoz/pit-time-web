import { DomainException } from '@domain/exceptions/domain-exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { EmailLength } from '@domain/enums/email-length.enum';

export class Email {
  private static VALIDATION_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    Email.validateInput(email);

    return new Email(email.trim());
  }

  private static validateInput(email: string): void {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || trimmedEmail.length === 0) {
      throw new DomainException('Email cannot be empty.', ExceptionCode.INVALID_EMAIL);
    }

    if (trimmedEmail.length < EmailLength.MIN) {
      throw new DomainException(`Email must be at least ${EmailLength.MIN} characters.`, ExceptionCode.INVALID_EMAIL);
    }

    if (trimmedEmail.length > EmailLength.MAX) {
      throw new DomainException(`Email must be at most ${EmailLength.MAX} characters.`, ExceptionCode.INVALID_EMAIL);
    }

    if (!Email.VALIDATION_REGEX.test(trimmedEmail)) {
      throw new DomainException('Invalid Email.', ExceptionCode.INVALID_EMAIL);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
