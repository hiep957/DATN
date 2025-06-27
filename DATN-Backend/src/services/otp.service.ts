import { AppDataSource } from "../data-source";
import { Otp } from "../entities/OTP";
import { BadRequestError } from "../utils/ApiError";
import { AuthService } from "./auth.service";

export class OTP {
  private otpRepo = AppDataSource.getRepository(Otp);
  async generateOTP(email: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    return otpCode;
  }
  async createOTP(email: string) {
    const existingOtp = await this.otpRepo.findOne({ where: { email } });
    if (existingOtp) {
      // If an OTP already exists, update it
      await this.otpRepo.delete({ email: email });
      console.log("Existing OTP deleted for email:", email);
    }
    const otpCode = await this.generateOTP(email);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    const otp = new Otp();
    // Check if an OTP already exists for this email

    otp.email = email;
    otp.otpCode = otpCode;
    otp.expiresAt = expiresAt;

    const data = await this.otpRepo.save(otp);
    console.log("OTP created:", data);
    // Send OTP to user's email

    return otpCode;
  }

  async verifyOTP(email: string, otpCode: string): Promise<boolean> {
    const otp = await this.otpRepo.findOne({ where: { email } });

    if (!otp) {
      throw new BadRequestError(
        "Không tìm thấy email nào liên kết với mã OTP này"
      );
    }
    if (otp.otpCode != otpCode) {
      throw new BadRequestError("Mã OTP không hợp lệ");
    }
    if (otp.expiresAt < new Date()) {
      await this.otpRepo.delete(otp);
      throw new BadRequestError("Mã OTP đã hết hạn");
    }
    await this.otpRepo.delete(otp);
    return true;
  }
}
