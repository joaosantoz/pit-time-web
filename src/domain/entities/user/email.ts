import { EmailLength } from '@domain/enums/email-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';
import { ValidationMessage } from '@domain/exceptions/messages/validation-message';

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
      throw new DomainValidationError(ValidationMessage.NO_SPACES('Email'));
    }

    if (!email || email.length === 0) {
      throw new DomainValidationError(ValidationMessage.EMPTY('Email'));
    }

    if (email.length < EmailLength.MIN) {
      throw new DomainValidationError(ValidationMessage.MIN_LENGTH('Email', EmailLength.MIN));
    }

    if (email.length > EmailLength.MAX) {
      throw new DomainValidationError(ValidationMessage.MAX_LENGTH('Email', EmailLength.MAX));
    }

    if (!Email.VALIDATION_REGEX.test(email)) {
      throw new DomainValidationError(ValidationMessage.INVALID('Email'));
    }
  }

  public getValue(): string {
    return this.value;
  }
}
