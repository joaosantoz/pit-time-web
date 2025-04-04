export class DomainException extends Error {
  public constructor(public override message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
