// 📁 src/routes/ProtectedRoute.tsx

import { JSX } from "react";
import { useAppSelector } from "../redux/hook";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  console.log("user trong protected router", user);

  if (!isAuthenticated || !user) {
    const isManualLogout = localStorage.getItem("isManualLogout");
    console.log("vào check protected route");
    if (!isManualLogout) {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
    }

    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
