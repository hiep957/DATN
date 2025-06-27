import { useState } from "react";
import { logoutAPI } from "../../../redux/api";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logout } from "../../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const dataUser = useAppSelector((state) => state.auth);
  console.log("dataUser trong header", dataUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.setItem("isManualLogout", "true"); // Đánh dấu bạn chủ động logout
    try {
      const res = await logoutAPI();
      if (res.success) {
        console.log("Đăng xuất thành công");

        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setTimeout(() => {
        localStorage.removeItem("isManualLogout");
      }, 1000); // Xóa flag sau 1s
    }
  };
  return (
    <header className="h-16 bg-slate-200 shadow flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold">Trang Quản Trị</h1>
        {dataUser.isAuthenticated ? (
          <div className="flex gap-4">
            <p className="flex items-center">
              Xin chào Admin,{" "}
              {dataUser.user?.firstName + " " + dataUser.user?.lastName}
            </p>
            <button
              className="p-2 bg-blue-200 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <button
              className="p-2 bg-blue-200 rounded-md "
              onClick={() => {
                navigate("/login-admin");
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
