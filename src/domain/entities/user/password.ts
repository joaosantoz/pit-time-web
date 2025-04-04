import { PasswordLength } from '@domain/enums/password-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';
import { PasswordMessage } from '@domain/exceptions/messages/password-message';
import { ValidationMessage } from '@domain/exceptions/messages/validation-message';

export class Password {
  private constructor(private readonly value: string) {}

  public static create(password: string): Password {
    Password.validateInput(password);

    return new Password(password);
  }

  private static validateInput(password: string): void {
    if (password.includes(' ')) {
      throw new DomainValidationError(ValidationMessage.NO_SPACES(this.name));
    }

    if (!password || password.length === 0) {
      throw new DomainValidationError(ValidationMessage.EMPTY(this.name));
    }

    if (password.length < PasswordLength.MIN) {
      throw new DomainValidationError(ValidationMessage.MIN_LENGTH(this.name, PasswordLength.MIN));
    }

    if (password.length > PasswordLength.MAX) {
      throw new DomainValidationError(ValidationMessage.MAX_LENGTH(this.name, PasswordLength.MAX));
    }

    if (!/[a-z]/.test(password)) {
      throw new DomainValidationError(PasswordMessage.LOWERCASE);
    }

    if (!/[A-Z]/.test(password)) {
      throw new DomainValidationError(PasswordMessage.UPPERCASE);
    }

    if (!/[0-9]/.test(password)) {
      throw new DomainValidationError(PasswordMessage.DIGIT);
    }

    if (!/[!@#$%^&*]/.test(password)) {
      throw new DomainValidationError(PasswordMessage.SPECIAL_CHARACTER);
    }
  }

  public compare(plainPassword: string): boolean {
    return this.value === plainPassword;
  }

  public getValue(): string {
    return this.value;
  }
}
