import { NameLength } from '@domain/enums/name-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';
import { PasswordLength } from '@domain/enums/password-length.enum';
import { ValidationMessage } from '@domain/exceptions/messages/validation-message';

export class Name {
  private constructor(private readonly value: string) {}

  public static create(name: string): Name {
    Name.validateInput(name);

    return new Name(name);
  }

  private static validateInput(name: string): void {
    if (!name.trim() || name.trim().length === 0) {
      throw new DomainValidationError(ValidationMessage.EMPTY(this.name));
    }

    if (name.length < NameLength.MIN) {
      throw new DomainValidationError(ValidationMessage.MIN_LENGTH(this.name, PasswordLength.MIN));
    }

    if (name.length > NameLength.MAX) {
      throw new DomainValidationError(ValidationMessage.MAX_LENGTH(this.name, PasswordLength.MAX));
    }
  }

  public getValue(): string {
    return this.value;
  }
}
