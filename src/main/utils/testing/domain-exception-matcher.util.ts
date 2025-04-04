import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { DomainException } from '@domain/exceptions/domain.exception';

export const createDomainExceptionMatcher = (expectedMessage: string, expectedCode: ExceptionCode) => {
  return (error: unknown) => error instanceof DomainException && error.message === expectedMessage && error.code === expectedCode;
};
