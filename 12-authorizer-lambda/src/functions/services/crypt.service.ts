import * as bcrypt from 'bcryptjs';

export class CryptService {
  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
