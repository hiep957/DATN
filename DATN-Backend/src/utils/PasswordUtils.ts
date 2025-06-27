import bcrypt from "bcrypt";

export class PasswordUtils {
  // Mặc định saltRounds là 10
  static async hashPassword(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
