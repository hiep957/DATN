import {
  IAuthRequest,
  ILoginRequest,
  LoginBody,
  SignupBody,
} from "../interfaces/Auth";
import { UserRepository } from "../repositories/auth.repo";
import { AuthService } from "../services/auth.service";
import { NextFunction, Response, Request } from "express";
import { BadRequestError } from "../utils/ApiError";
import { Sign } from "crypto";

import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { console } from "inspector";
import { GoogleDriveService } from "../utils/UploadFile/GoogleDriveService";
import { OTP } from "../services/otp.service";

const CLENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
const REDIRECT_URI = process.env.REDIRECT_URI || "";

const oAuth2Client = new OAuth2Client(CLENT_ID, CLIENT_SECRET, REDIRECT_URI);

export class AuthController {
  private authService = new AuthService();
  //Request<Params, ResBody, ReqBody, Query>
  private otpService = new OTP();
  register = async (
    req: Request<{}, {}, SignupBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { firstName, lastName, email, password, confirmPassword, role } =
      req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new BadRequestError("All fields are required");
    }
    const result = await this.authService.register({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1h
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.json({ message: "Đăng ký thành công", data: result.user });
  };

  loginGoogleRedirect = async (req: Request, res: Response) => {
    console.log(CLENT_ID);
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });
    console.log("Redirecting to Google login URL:", url);
    return res.redirect(url);
  };

  loginGoogleCallback = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "No code provided" });
    }

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      const userInfoRes = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const profile = userInfoRes.data;

      // Gọi service để xử lý đăng nhập/đăng ký bằng Google
      const result = await this.authService.loginWithGoogle(profile);

      // Set cookie giống như login thường
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect("http://localhost:5173/auth/callback"); // Redirect về trang dashboard sau khi đăng nhập thành công
    } catch (err) {
      console.error(err);
      throw new BadRequestError("Google login failed");
    }
  };

  login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;
    console.log("Login request body:", req.body); // Log the request body for debugging
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    const result = await this.authService.login(email, password);
    if (!result.success) {
      throw new BadRequestError("Invalid email or password");
    }
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1h
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.json({ message: "Đăng nhập thành công", data: result.user });
  };

  getUserInfo = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user?.id;
    console.log("User ID from token:", userId); // Log the user ID for debugging
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const user = await this.authService.getUserById(userId);
    return res.json({
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  };

  testAdmin = async (req: Request, res: Response) => {
    return res.json({ message: "Admin access granted" });
  };

  logout = async (req: IAuthRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new BadRequestError("User not found");
    }
    await this.authService.logout(user.id);
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  };

  refreshToken = async (req: IAuthRequest, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1h
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    res.json({ message: "Token refreshed successfully", data: tokens });
  };

  //cần sửa trong tương lai
  updateMe = async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { ...userData } = req.body;

    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const result = await this.authService.updateSelf(userId, userData);
    return res.json({ message: "Cập nhật thông tin thành công", data: result });
  };

  generateOTP = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email is required");
    }
    const result = await this.otpService.createOTP(email);
    return res.json({ message: "Gửi mã OTP thành công", data: result });
  };

  verifyOTP = async (req: Request, res: Response) => {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      throw new BadRequestError("Email and OTP code are required");
    }
    const result = await this.otpService.verifyOTP(email, otpCode);
    return res.json({ message: "Xác thực mã OTP thành công", data: result });
  };

  sendOtpToEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Email is required");
    }
    const code = await this.authService.sendOtpToEmail(email);
    return res.json({ message: "Mã OTP đã được gửi đến email", data: code });
  };

  changePassword = async (req: IAuthRequest, res: Response) => {
    // const userId = req.user?.id;
    const { newPassword, oldPassword, userId } = req.body;
    console.log("Change password request body:", req.body); // Log the request body for debugging
    if (!userId || !newPassword || !oldPassword) {
      throw new BadRequestError(
        "User ID, old password and new password are required"
      );
    }
    if (newPassword === oldPassword) {
      throw new BadRequestError(
        "Mật khẩu mới không được trùng với mật khẩu cũ"
      );
    }
    const result = await this.authService.changePassword(
      newPassword,
      oldPassword,
      userId
    );
    return res.json({ message: "Đổi mật khẩu thành công", data: result });
  };

  getUser = async (req: Request, res: Response) => {
    console.log("getUser called with params:", req.query);
    const { id, name, page = "1", limit = "10" } = req.query;
    const filters = {
      id: id ? parseInt(id as string, 10) : undefined,
      name: name as string,
    };
    console.log("Filters");
    const pagination = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await this.authService.getUser(filters, pagination);
    console.log("getUser result:", result);
    return res.json({
      message: "Lấy danh sách người dùng thành công",
      total: result.total,
      data: result.data,
      page: pagination.page,
      limit: pagination.limit,
    });
  };
}
