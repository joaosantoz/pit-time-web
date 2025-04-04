import { User } from '@domain/entities/user/user';
import { Email } from '@domain/entities/user/email';
import { Password } from '@domain/entities/user/password';

export interface AuthRepository {
  register(user: User): Promise<User>;

  login(email: Email, password: Password): Promise<{ user: User; token: string }>;

  logout(userId: number): Promise<void>;

  getUserInfo(userId: number): Promise<User>;

  isUserLogged(userId: number): Promise<boolean>;
}
