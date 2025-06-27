import { Request } from "express";
import { User } from "../../entities/User";

export interface ILoginRequest extends Request {
  body: { email: string; password: string };
}

export interface IAuthRequest extends Request {
  headers: { authorization?: string; Authorization?: string };
  cookies: { authToken?: string; accessToken?: string; refreshToken?: string };
  user?: User;
  status?: string;
  userId?: number;
  newPassword?: string;
  oldPassword?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
