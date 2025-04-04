import { DomainException } from '@domain/exceptions/domain.exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { EmailLength } from '@domain/enums/email-length.enum';

export class Email {
  private static VALIDATION_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    Email.validateInput(email);

    return new Email(email);
  }

  private static validateInput(email: string): void {
    if (email.includes(' ')) {
      throw new DomainException('Email cannot contain spaces.', ExceptionCode.INVALID_EMAIL);
    }

    if (!email || email.length === 0) {
      throw new DomainException('Email cannot be empty.', ExceptionCode.INVALID_EMAIL);
    }

    if (email.length < EmailLength.MIN) {
      throw new DomainException(`Email must be at least ${EmailLength.MIN} characters.`, ExceptionCode.INVALID_EMAIL);
    }

    if (email.length > EmailLength.MAX) {
      throw new DomainException(`Email must be at most ${EmailLength.MAX} characters.`, ExceptionCode.INVALID_EMAIL);
    }

    if (!Email.VALIDATION_REGEX.test(email)) {
      throw new DomainException('Invalid Email.', ExceptionCode.INVALID_EMAIL);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
