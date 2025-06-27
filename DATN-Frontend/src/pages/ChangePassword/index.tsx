import { useState } from "react";
import LayoutClient from "../../components/layout/Client/LayoutClient";

import SidebarClient from "../../components/ui/SidebarClient";
import { customFetch } from "../../features/customFetch";
import { useAppSelector } from "../../redux/hook";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const ChangePassword = () => {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  console.log("User:", user);
  const handleStepOne = async () => {
    // Logic to handle step one, e.g., sending OTP
    setLoading(true);
    const response = await customFetch(
      `${BASE_URL}/api/auth/send-email-changepassword`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email }),
      }
    );
    if (response.ok) {
      setLoading(false);
      const data = await response.json();
      console.log("OTP sent successfully:", data);
      toast.success("Mã OTP đã được gửi đến email của bạn");
      // Proceed to the next step
      setStep(2);
    } else {
      setLoading(false);
      const errorData = await response.json();
      console.error("Error sending OTP:", errorData);
      toast.error("Gửi mã OTP thất bại");
    }
  };

  const handleStepTwo = async () => {
    // Logic to handle step two, e.g., verifying OTP
    if (!otp) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }
    setLoading(true);
    const response = await customFetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user?.email, otpCode: otp }),
    });
    if (response.ok) {
      setLoading(false);
      const data = await response.json();
      console.log("OTP verified successfully:", data);
      toast.success("Mã OTP xác thực thành công");
      // Proceed to the next step
      setStep(3);
    } else {
      setLoading(false);
      const errorData = await response.json();
      console.error("Error verifying OTP:", errorData);
      toast.error("Xác thực mã OTP thất bại");
    }
  };


  const handleChangePassword = async () => {
    // Logic to handle changing the password
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập mật khẩu cũ và mật khẩu mới");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (newPassword === oldPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    setLoading(true);
    const response = await customFetch(`${BASE_URL}/api/auth/change-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: newPassword,
        oldPassword: oldPassword,
        userId: user?.id, // Assuming user ID is available in the user object
      }),
    });
    if (response.ok) {
      setLoading(false);
      const data = await response.json();
      console.log("Password changed successfully:", data);
      toast.success("Đổi mật khẩu thành công");
      // Reset the form or redirect as needed
      setStep(1);
      setOtp("");
      setNewPassword("");
      setOldPassword("");
    } else {
      setLoading(false);
      const errorData = await response.json();
      console.error("Error changing password:", errorData);
      toast.error("Đổi mật khẩu thất bại");
    }
  }

  return (
    <LayoutClient>
      <div className="grid grid-cols-12 gap-4 md:px-32 md:py-4">
        <div className="col-span-3  h-[300px]">
          <SidebarClient />
        </div>
        <div className="col-span-9 w-full h-full flex justify-center">
          <div className="flex justify-center items-center border w-1/2 bg-white rounded border-gray-400">
            {step === 1 && (
              <>
                {/* Step 1: Bạn muốn đổi password*/}
                <div className="flex flex-col items-center justify-center px-4 space-y-2">
                  <p className="font-bold text-xl">Bạn muốn đổi password</p>
                  <p className="font-light">
                    Nhấn để hệ thống gửi mã OTP đén email của bạn, mã OTP của
                    bạn có thời hạn 5 phút, tuyệt đối không chia sẻ
                  </p>
                  {loading ? (
                    <CircularProgress></CircularProgress>
                  ) : (
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      onClick={handleStepOne}
                    >
                      Gửi mã OTP
                    </button>
                  )}
                </div>
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center p-4 space-y-2">
                <p>Vui lòng nhập mã OTP đã gửi đến email của bạn</p>
                <input
                  type="text"
                  placeholder="Mã OTP"
                  className="border p-2 rounded"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)} // ✅ Cập nhật giá trị
                />
                {loading ? (
                  <CircularProgress></CircularProgress>
                ) : (
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={handleStepTwo} // ✅ Gọi hàm xác thực OTP
                  >
                    Xác nhận
                  </button>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center p-4 space-y-2 w-full">
                <p>Nhập mật khẩu cũ và mật khẩu mới</p>
                <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  placeholder="Mật khẩu cũ"
                  className="border p-2 rounded w-full"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="border p-2 rounded w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {loading ? (
                  <CircularProgress />
                ) : (
                  <button
                    className="bg-green-600 text-white py-2 px-4 rounded"
                    onClick={handleChangePassword}
                  >
                    Đổi mật khẩu
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default ChangePassword;
