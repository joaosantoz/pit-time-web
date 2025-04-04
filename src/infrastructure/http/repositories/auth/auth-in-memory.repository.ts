import { Email } from '@domain/entities/user/email';
import { Password } from '@domain/entities/user/password';
import { User } from '@domain/entities/user/user';
import { DomainException } from '@domain/exceptions/domain.exception';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { Injectable } from '@angular/core';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  private readonly users: Set<User> = new Set();
  private readonly sessions: Map<number, string> = new Map();

  public async register(newUser: User): Promise<User> {
    const exists = Array.from(this.users).some((user: User) => {
      return user.getEmail().getValue() === newUser.getEmail().getValue();
    });

    if (exists) {
      throw new DomainException('Email already registered.');
    }

    const user = newUser.withId(this.users.size + 1);
    this.users.add(user);

    return Promise.resolve(user);
  }

  public async login(email: Email, password: Password): Promise<{ user: User; token: string }> {
    const user = Array.from(this.users).find((user: User) => user.getEmail().getValue() === email.getValue());

    if (!user || !user.comparePassword(password.getValue())) {
      return Promise.reject(new DomainException('Invalid email or password.'));
    }

    const token = `mock-token-${crypto.randomUUID()}`;
    this.sessions.set(user.getId()!, token);

    return Promise.resolve({ user, token });
  }

  public async logout(userId: number): Promise<void> {
    this.sessions.delete(userId);
    return Promise.resolve();
  }

  public async getUserInfo(userId: number): Promise<User> {
    const userInfo = Array.from(this.users).find((user: User) => user.getId() === userId);

    if (!userInfo) {
      return Promise.reject(new DomainException('User not found.'));
    }

    return Promise.resolve(userInfo);
  }

  public async isUserLogged(userId: number): Promise<boolean> {
    const isLogged = this.sessions.has(userId);
    return Promise.resolve(isLogged);
  }

  // Test util
  public seedUser(user: User): void {
    this.users.add(user);
  }
}
