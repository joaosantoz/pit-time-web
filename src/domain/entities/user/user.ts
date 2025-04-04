import { Email } from '@domain/entities/user/email';
import { Role } from '@domain/enums/role.enum';
import { Password } from '@domain/entities/user/password';

export class User {
  private constructor(
    private readonly name: string,
    private readonly email: Email,
    private readonly password: Password,
    private readonly role: Role,
    private readonly id?: number
  ) {}

  public static create(name: string, email: Email, password: Password, role: Role, id?: number): User {
    return new User(name, email, password, role, id);
  }
}
