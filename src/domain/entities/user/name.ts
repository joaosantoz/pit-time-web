import { DomainException } from '@domain/exceptions/domain.exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { NameLength } from '@domain/enums/name-length.enum';

export class Name {
  private constructor(private readonly value: string) {}

  public static create(name: string): Name {
    Name.validateInput(name);

    return new Name(name);
  }

  private static validateInput(name: string): void {
    if (!name.trim() || name.trim().length === 0) {
      throw new DomainException('Name cannot be empty.', ExceptionCode.INVALID_NAME);
    }

    if (name.length < NameLength.MIN) {
      throw new DomainException(`Name must be at least ${NameLength.MIN} characters.`, ExceptionCode.INVALID_NAME);
    }

    if (name.length > NameLength.MAX) {
      throw new DomainException(`Name must be at most ${NameLength.MAX} characters.`, ExceptionCode.INVALID_NAME);
    }
  }

  public getValue(): string {
    return this.value;
  }
}
