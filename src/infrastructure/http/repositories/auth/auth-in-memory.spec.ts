import { Email } from '@domain/entities/user/email';
import { Password } from '@domain/entities/user/password';
import { Name } from '@domain/entities/user/name';
import { User } from '@domain/entities/user/user';
import { DomainException } from '@domain/exceptions/domain.exception';
import { TestBed } from '@angular/core/testing';
import { Role } from '@domain/enums/role.enum';
import { InMemoryAuthRepository } from '@infrastructure/http/repositories/auth/auth-in-memory.repository';

describe('InMemoryAuthRepository', () => {
  let repository: InMemoryAuthRepository;

  const mockName = Name.create('John Doe');
  const mockEmail = Email.create('john@example.com');
  const mockPassword = Password.create('ValidPass123!');
  const mockRole = Role.EMPLOYEE;

  const mockUser = User.create(mockName, mockEmail, mockPassword, mockRole);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InMemoryAuthRepository]
    });

    repository = TestBed.inject(InMemoryAuthRepository);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user = await repository.register(mockUser);
      expect(user).toBeInstanceOf(User);
      expect(user.getId()).toBe(1);
    });

    it('should throw when email already exists', async () => {
      await repository.register(mockUser);

      await expectAsync(repository.register(mockUser)).toBeRejectedWithError(DomainException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      await repository.register(mockUser);
      const result = await repository.login(mockEmail, mockPassword);

      expect(result.user).toBeInstanceOf(User);
      expect(result.token).toContain('mock-token');
    });

    it('should throw with invalid email', async () => {
      await expectAsync(repository.login(mockEmail, mockPassword)).toBeRejectedWithError(DomainException);
    });

    it('should throw with invalid password', async () => {
      await repository.register(mockUser);
      const wrongPassword = Password.create('WrongPass123!');

      await expectAsync(repository.login(mockEmail, wrongPassword)).toBeRejectedWithError(DomainException);
    });
  });

  describe('logout', () => {
    it('should remove user session', async () => {
      await repository.register(mockUser);
      const { user } = await repository.login(mockEmail, mockPassword);

      await repository.logout(user.getId()!);
      const isLogged = await repository.isUserLogged(user.getId()!);

      expect(isLogged).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      await repository.register(mockUser);
      const user = await repository.getUserInfo(1);

      expect(user).toBeInstanceOf(User);
      expect(user.getName().getValue()).toBe(mockName.getValue());
      expect(user.getEmail().getValue()).toBe(mockEmail.getValue());
      expect(user.getRole()).toBe(mockRole);
    });

    it('should throw when user not found', async () => {
      await expectAsync(repository.getUserInfo(999)).toBeRejectedWithError(DomainException);
    });
  });

  describe('isUserLogged', () => {
    it('should return true when user is logged in', async () => {
      await repository.register(mockUser);
      const { user } = await repository.login(mockEmail, mockPassword);

      const isLogged = await repository.isUserLogged(user.getId()!);
      expect(isLogged).toBe(true);
    });

    it('should return false when user is not logged in', async () => {
      const isLogged = await repository.isUserLogged(1);
      expect(isLogged).toBe(false);
    });
  });

  describe('seedUser (test util)', () => {
    it('should add user to repository', () => {
      repository.seedUser(mockUser);
      expect(repository.getUserInfo(1)).toBeDefined();
    });
  });
});
