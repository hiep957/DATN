import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hook";

const SidebarClient = () => {
  const location = useLocation(); // lấy URL hiện tại
  const currentPath = location.pathname;
  const { user } = useAppSelector((state) => state.auth);
  console.log("user trong SidebarClient", user);
  const isActive = (path: string) => currentPath === path;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow">
      <div
        className={`p-2 flex justify-center rounded ${
          isActive("/profile") ? "bg-blue-300 font-semibold" : ""
        }`}
      >
        <Link to="/profile">Thông tin cá nhân</Link>
      </div>
      <div
        className={`p-2 flex justify-center  ${
          isActive("/my-orders") ? "bg-blue-300 font-semibold" : ""
        }`}
      >
        <Link to="/my-orders">Đơn hàng của tôi</Link>
      </div>
      {user?.provider === "local" && (
        <div
          className={`p-2 flex justify-center  ${
            isActive("/change-password") ? "bg-blue-300 font-semibold" : ""
          }`}
        >
          <Link to="/change-password">Đổi mật khẩu</Link>
        </div>
      )}
    </div>
  );
};

export default SidebarClient;
