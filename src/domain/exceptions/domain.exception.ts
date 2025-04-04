import { ExceptionCode } from '@domain/enums/exception-code.enum';

export class DomainException extends Error {
  public constructor(
    public override message: string,
    public readonly code: ExceptionCode
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
