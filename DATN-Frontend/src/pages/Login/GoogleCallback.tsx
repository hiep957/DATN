import { useEffect } from "react";
import { setUserAPI } from "../../redux/api";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setUser } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../redux/slice/cartSlice";

const GoogleCallback = () => {
  const dispatch = useAppDispatch();
  const dataUser = useAppSelector((state) => state.auth); // Lấy thông tin người dùng từ Redux
  const navigate = useNavigate();
  const createCart = async () => {
    const res = await fetch("http://localhost:3000/api/cart/create-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Để gửi cookie
    });
    if (!res.ok) {
      const error = await res.json();
      toast.error(error.message || "Tạo giỏ hàng thất bại");
      throw new Error(error.message || "Tạo giỏ hàng thất bại");
    }
  };
  const fetchCurrentUser = async () => {
    try {
      const res = await setUserAPI();
      dispatch(setUser(res.data)); //  Cập nhật vào Redux
      console.log("Thông tin người dùng sau khi đăng nhập:", res.data); // Log thông tin người dùng
      if (res.data.role === "user") {
        toast.success("Đăng nhập Google thành công");
        await createCart(); // Tạo giỏ hàng nếu là người dùng
        await dispatch(fetchCart()); // Fetch giỏ hàng sau khi tạo
        navigate("/"); 
      }
    } catch (err) {
      console.error("Không thể lấy thông tin người dùng", err);
    }
  };

  // Gọi hàm fetchCurrentUser khi component được mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return <div>Trang nhận callback</div>;
};

export default GoogleCallback;
