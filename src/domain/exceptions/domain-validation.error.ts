import { DomainException } from '@domain/exceptions/domain.exception';

export class DomainValidationError extends DomainException {
  public constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
