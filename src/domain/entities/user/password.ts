import { DomainException } from '@domain/exceptions/domain-exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { PasswordLength } from '@domain/enums/password-length.enum';

export class Password {
  private constructor(private readonly value: string) {}

  public static create(password: string): Password {
    Password.validateInput(password);

    return new Password(password);
  }

  private static validateInput(password: string): void {
    if (!password || password.trim().length === 0) {
      throw new DomainException('Password cannot be empty.', ExceptionCode.INVALID_PASSWORD);
    }

    if (password.trim().length < PasswordLength.MIN) {
      throw new DomainException(`Password must be at least ${PasswordLength.MIN} characters.`, ExceptionCode.INVALID_PASSWORD);
    }

    if (password.trim().length > PasswordLength.MAX) {
      throw new DomainException(`Password must be at most ${PasswordLength.MAX} characters.`, ExceptionCode.INVALID_PASSWORD);
    }

    if (!/[a-z]/.test(password)) {
      throw new DomainException('Password must contain at least one lowercase letter.', ExceptionCode.INVALID_PASSWORD);
    }

    if (!/[A-Z]/.test(password)) {
      throw new DomainException('Password must contain at least one uppercase letter.', ExceptionCode.INVALID_PASSWORD);
    }

    if (!/[0-9]/.test(password)) {
      throw new DomainException('Password must contain at least one digit.', ExceptionCode.INVALID_PASSWORD);
    }

    if (!/[!@#$%^&*]/.test(password)) {
      throw new DomainException('Password must contain at least one special character.', ExceptionCode.INVALID_PASSWORD);
    }

    if (password.includes(' ')) {
      throw new DomainException('Password cannot contain spaces.', ExceptionCode.INVALID_PASSWORD);
    }
  }

  public compare(plainPassword: string): boolean {
    return this.value === plainPassword;
  }

  public getValue(): string {
    return this.value;
  }
}
