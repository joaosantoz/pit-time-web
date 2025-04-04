import { Name } from '@domain/entities/user/name';
import { Email } from '@domain/entities/user/email';
import { Role } from '@domain/enums/role.enum';
import { User } from '@domain/entities/user/user';
import { Password } from '@domain/entities/user/password';
import { DomainException } from '@domain/exceptions/domain.exception';

describe('User', () => {
  const validName = Name.create('User Name');
  const validEmail = Email.create('user@mail.com');
  const validPassword = Password.create('ValidPassword123!@');
  const validRole = Role.EMPLOYEE;

  describe('create()', () => {
    it('should create a valid user', () => {
      const validUser = User.create(validName, validEmail, validPassword, validRole);

      expect(validUser).toBeInstanceOf(User);
      expect(validUser.getName()).toEqual(validName);
      expect(validUser.getEmail()).toEqual(validEmail);
      expect(validUser.comparePassword(validPassword.getValue())).toBe(true);
      expect(validUser.getRole()).toEqual(validRole);
    });

    it('should create a user with optional id', () => {
      const user = User.create(validName, validEmail, validPassword, validRole, 1);

      expect(user.getId()).toEqual(1);
    });

    it('should throw when role is invalid', () => {
      const invalidRole = 'INVALID_ROLE' as Role;

      expect(() => {
        User.create(validName, validEmail, validPassword, invalidRole);
      }).toThrowError(DomainException);
    });

    it('should throw when id is invalid', () => {
      expect(() => {
        User.create(validName, validEmail, validPassword, validRole, 0);
      }).toThrowError(DomainException);

      expect(() => {
        User.create(validName, validEmail, validPassword, validRole, -1);
      }).toThrowError(DomainException);
    });
  });

  describe('hasPermission', () => {
    it('should return true when ADMIN has any permission', () => {
      const admin = User.create(validName, validEmail, validPassword, Role.ADMIN);

      expect(admin.hasPermission(Role.ADMIN)).toBe(true);
      expect(admin.hasPermission(Role.MANAGER)).toBe(true);
      expect(admin.hasPermission(Role.EMPLOYEE)).toBe(true);
    });

    it('should return correct permissions for MANAGER', () => {
      const manager = User.create(validName, validEmail, validPassword, Role.MANAGER);

      expect(manager.hasPermission(Role.MANAGER)).toBe(true);
      expect(manager.hasPermission(Role.EMPLOYEE)).toBe(true);
      expect(manager.hasPermission(Role.ADMIN)).toBe(false);
    });

    it('should return correct permissions for EMPLOYEE', () => {
      const employee = User.create(validName, validEmail, validPassword, Role.EMPLOYEE);

      expect(employee.hasPermission(Role.EMPLOYEE)).toBe(true);
      expect(employee.hasPermission(Role.MANAGER)).toBe(false);
      expect(employee.hasPermission(Role.ADMIN)).toBe(false);
    });

    it('should throw when requiredRole is invalid', () => {
      const user = User.create(validName, validEmail, validPassword, Role.EMPLOYEE);
      const invalidRole = 'INVALID_ROLE' as Role;

      expect(() => {
        user.hasPermission(invalidRole);
      }).toThrowError(DomainException);
    });

    it('should throw when requiredRole is undefined', () => {
      const user = User.create(validName, validEmail, validPassword, Role.EMPLOYEE);
      const undefinedRole = undefined as unknown as Role;

      expect(() => {
        user.hasPermission(undefinedRole);
      }).toThrowError(DomainException);
    });
  });

  describe('withId', () => {
    it('should return a new user with updated id', () => {
      const originalUser = User.create(validName, validEmail, validPassword, validRole);
      const updatedUser = originalUser.withId(2);

      expect(updatedUser.getId()).toEqual(2);
      expect(updatedUser).not.toBe(originalUser);
    });
  });

  describe('withName', () => {
    it('should return a new user with updated name', () => {
      const originalUser = User.create(validName, validEmail, validPassword, validRole);
      const newName = Name.create('Jane Doe');
      const updatedUser = originalUser.withName(newName);

      expect(updatedUser.getName()).toEqual(newName);
      expect(updatedUser).not.toBe(originalUser);
    });
  });

  describe('canRegisterTime', () => {
    it('should return true for EMPLOYEE and MANAGER', () => {
      const employee = User.create(validName, validEmail, validPassword, Role.EMPLOYEE);
      const manager = User.create(validName, validEmail, validPassword, Role.MANAGER);

      expect(employee.canRegisterTime()).toBe(true);
      expect(manager.canRegisterTime()).toBe(true);
    });

    it('should return false for ADMIN', () => {
      const admin = User.create(validName, validEmail, validPassword, Role.ADMIN);
      expect(admin.canRegisterTime()).toBe(false);
    });
  });

  describe('canApproveTime', () => {
    it('should return true for MANAGER and ADMIN', () => {
      const manager = User.create(validName, validEmail, validPassword, Role.MANAGER);
      const admin = User.create(validName, validEmail, validPassword, Role.ADMIN);

      expect(manager.canApproveTime()).toBe(true);
      expect(admin.canApproveTime()).toBe(true);
    });

    it('should return false for EMPLOYEE', () => {
      const employee = User.create(validName, validEmail, validPassword, Role.EMPLOYEE);
      expect(employee.canApproveTime()).toBe(false);
    });
  });

  describe('comparePassword', () => {
    it('should return true when password matches', () => {
      const samePassword = validPassword;
      const user = User.create(validName, validEmail, validPassword, validRole);

      expect(user.comparePassword(samePassword.getValue())).toBe(true);
    });

    it('should return false when password does not match', () => {
      const differentPassword = Password.create('DifferentPass1!@');
      const user = User.create(validName, validEmail, validPassword, validRole);

      expect(user.comparePassword(differentPassword.getValue())).toBe(false);
    });
  });
});
