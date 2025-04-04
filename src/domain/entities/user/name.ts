import { NameLength } from '@domain/enums/name-length.enum';
import { DomainValidationError } from '@domain/exceptions/domain-validation.error';
import { ValidationMessage } from '@domain/exceptions/messages/validation-message';

export class Name {
  private constructor(private readonly value: string) {}

  public static create(name: string): Name {
    Name.validateInput(name);

    return new Name(name);
  }

  private static validateInput(name: string): void {
    if (!name.trim() || name.trim().length === 0) {
      throw new DomainValidationError(ValidationMessage.EMPTY('Name'));
    }

    if (name.length < NameLength.MIN) {
      throw new DomainValidationError(ValidationMessage.MIN_LENGTH('Name', NameLength.MIN));
    }

    if (name.length > NameLength.MAX) {
      throw new DomainValidationError(ValidationMessage.MAX_LENGTH('Name', NameLength.MAX));
    }
  }

  public getValue(): string {
    return this.value;
  }
}
