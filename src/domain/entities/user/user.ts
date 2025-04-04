import { Email } from '@domain/entities/user/email';
import { Role } from '@domain/enums/role.enum';
import { Password } from '@domain/entities/user/password';
import { DomainException } from '@domain/exceptions/domain.exception';
import { ExceptionCode } from '@domain/enums/exception-code.enum';
import { Name } from '@domain/entities/user/name';

export class User {
  private constructor(
    private readonly name: Name,
    private readonly email: Email,
    private readonly password: Password,
    private readonly role: Role,
    private readonly id?: number
  ) {}

  public static create(name: Name, email: Email, password: Password, role: Role, id?: number): User {
    if (!Object.values(Role).includes(role)) {
      throw new DomainException('Invalid role.', ExceptionCode.INVALID_ROLE);
    }

    if (typeof id === 'number' && id <= 0) {
      throw new DomainException('Invalid ID.', ExceptionCode.INVALID_ID);
    }

    return new User(name, email, password, role, id);
  }

  public hasPermission(requiredRole: Role): boolean {
    const permissions = {
      [Role.ADMIN]: [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE],
      [Role.MANAGER]: [Role.MANAGER, Role.EMPLOYEE],
      [Role.EMPLOYEE]: [Role.EMPLOYEE]
    };

    return permissions[this.role].includes(requiredRole);
  }

  public withId(id: number): User {
    return User.create(this.name, this.email, this.password, this.role, id);
  }

  public withName(name: Name): User {
    return User.create(name, this.email, this.password, this.role, this.id);
  }

  public canRegisterTime(): boolean {
    return this.hasPermission(Role.EMPLOYEE) && !this.hasPermission(Role.ADMIN);
  }

  public canApproveTime(): boolean {
    return this.hasPermission(Role.MANAGER);
  }

  public comparePassword(plainPassword: string): boolean {
    return this.password.compare(plainPassword);
  }

  public getName(): Name {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getRole(): Role {
    return this.role;
  }

  public getId(): number | undefined {
    return this.id;
  }
}
