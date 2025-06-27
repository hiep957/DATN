import { UserRepository } from "../repositories/auth.repo";
import { BadRequestError, UnauthorizedError } from "../utils/ApiError";
import { TokenUtils } from "../utils/TokenUtils";
import { SignupBody } from "../interfaces/Auth";
import { PasswordUtils } from "../utils/PasswordUtils";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../entities/User";
import { OTP } from "./otp.service";
const app_password = process.env.APP_PASSWORD?.toString();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "hiepma80@gmail.com",
    pass: app_password,
  },
});
export class AuthService {
  private userRepo = new UserRepository();
  private otpService = new OTP();
  async register(userData: SignupBody) {
    const existingUser = await this.userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }
    if (userData.password !== userData.confirmPassword) {
      throw new BadRequestError("Password and confirm password do not match");
    }
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);
    const newUser = await this.userRepo.createUser({
      ...userData,
      password: hashedPassword,
    });
    const accessToken = TokenUtils.generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    const refreshToken = TokenUtils.generateRefreshToken({ id: newUser.id });
    newUser.refreshToken = refreshToken;
    const savedUser = await this.userRepo.saveUser(newUser);
    return { success: true, accessToken, refreshToken, user: savedUser };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (!user.password) {
      throw new BadRequestError("Password is missing for the user");
    }
    const isMatch = await PasswordUtils.comparePassword(
      password,
      user.password
    );
    // const isMatch = password === user.password; // For testing purposes, use plain text comparison
    if (!isMatch) {
      throw new BadRequestError("Invalid password");
    }
    const accessToken = TokenUtils.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = TokenUtils.generateRefreshToken({ id: user.id });
    user.refreshToken = refreshToken;
    await this.userRepo.saveUser(user);

    return { success: true, accessToken, refreshToken, user };
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    return user;
  }

  async loginWithGoogle(profile: any) {
    let user = await this.userRepo.findByEmail(profile.email);
    if (!user) {
      console.log("User not found, creating new user");
      user = await this.userRepo.createUser({
        firstName: profile.given_name || "Google",
        lastName: profile.family_name || "User",
        email: profile.email,
        password: "", // Có thể đặt password ngẫu nhiên hoặc rỗng
        provider: "google", // nên có field provider để phân biệt tài khoản thường/Google
      });
    } else {
      console.log("Da co user nay roi, khong can tao moi");
    }
    const accessToken = TokenUtils.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = TokenUtils.generateRefreshToken({ id: user.id });
    user.refreshToken = refreshToken;
    await this.userRepo.saveUser(user);
    return {
      success: true,
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    user.refreshToken = ""; // Xóa refresh token
    await this.userRepo.saveUser(user);
    return { success: true, message: "Logout successful" };
  }

  async refreshToken(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new BadRequestError("Refresh token is required");
    }
    let payload: any;
    payload = TokenUtils.verifyRefreshToken(oldRefreshToken);

    const user = await this.userRepo.findById(payload.id);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedError("Invalid refresh token or user not found");
    }
    const newAccessToken = TokenUtils.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = TokenUtils.generateRefreshToken({ id: user.id });
    user.refreshToken = newRefreshToken;
    const userSaved = await this.userRepo.saveUser(user);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: userSaved,
    };
  }

  // update info without password, email, role
  async updateSelf(userId: number, userData: Partial<User>) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const { lastName, firstName, phoneNumber, address, avatar } = userData;

    if (lastName) user.lastName = lastName;
    if (firstName) user.firstName = firstName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;

    const updatedUser = await this.userRepo.saveUser(user);

    return updatedUser;
  }

  async sendOtpToEmail(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestError("Người dùng không có trong hệ thống");
    }
    const code = await this.otpService.createOTP(email);
    if (!code) {
      throw new BadRequestError("Failed to generate OTP");
    }
    await transporter.sendMail({
      from: "hiepma80@gmail.com",
      to: email,
      subject: "Email Xác nhận đổi mật khẩu",
      text: "Hãy bảo mật mã này, không chia sẻ cho người khác. Thời gian tồn tại mã là 5 phút",
      html: `<p>Mã để bạn có thể đổi mật khẩu: <strong>${code}</strong></p> <p>Hãy bảo mật mã này, không chia sẻ cho người khác. Thời gian tồn tại mã là 5 phút</p>`,
    });
    return code;
  }

  async changePassword(newPassword: string, oldPassword: string, id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new BadRequestError("Người dùng không có trong hệ thống");
    }
    if (!user.password) {
      throw new BadRequestError("Password is missing for the user");
    }
    const isMatch = await PasswordUtils.comparePassword(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      throw new BadRequestError(
        "Mật khẩu của bạn nhập không chính xác"
      );
    }
    
    const hashedPassword = await PasswordUtils.hashPassword(newPassword);
    user.password = hashedPassword;
    const userUpdated = await this.userRepo.saveUser(user);
    return userUpdated;
  }

  async getUser(
    filters: { id?: number; name?: string },
    pagination: { page: number; limit: number }
  ) {
    console.log("getUser called with filters:", filters, "pagination:", pagination);
    const { data, total } = await this.userRepo.findUser(filters, pagination);
    return { data, total };
  }
}
