import { useEffect } from "react";
import { useAppDispatch } from "../redux/hook";
import { logout, setUser } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
          dispatch(setUser(data.data));
        } else if (
          res.status === 401 &&
          data.message === "Access token is missing"
        ) {
          const refresh = await fetch(
            "http://localhost:3000/api/auth/refresh-token",
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (refresh.ok) {
            toast.success("Đã làm mới access token!");
            // Gọi lại checkAuth để cập nhật user
            await checkAuth();
          } else {
            dispatch(logout());
            navigate("/login");
          }
        } else {
          dispatch(logout());
          navigate("/login");
        }
      } catch (err) {
        dispatch(logout());
        navigate("/login");
      }
    };
    checkAuth();
  }, [dispatch, navigate]);
};

export default useAuth;
