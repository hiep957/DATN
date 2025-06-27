import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "hiep123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "hiep1234";

export class TokenUtils {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "1h" });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, REFRESH_SECRET!, {
      expiresIn: "7d",
    });
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET);
  }
}
