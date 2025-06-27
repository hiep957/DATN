import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { loginUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCart } from "../../redux/slice/cartSlice";
type LoginFormInputs = {
  email: string;
  password: string;
};

const ClientLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Form Data:", data);
    const resultAction = await dispatch(loginUser(data));
    console.log("resultAction: ", resultAction);
    const role = resultAction.payload.role || "";

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("user trong login sau khi đăng nhập", user);
      console.log(loginUser.fulfilled.match(resultAction));
      if (role === "user") {
        toast.success("Đăng nhập thành công");
        navigate("/");
        dispatch(fetchCart());
      } else if (role === "admin") {
        toast.success(
          "Email của bạn đã được đăng ký làm admin, vui lòng dùng tài khoản khác"
        );
      }
    } else {
      console.log("Login failed: ", resultAction.error.message);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-blue-200">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
    >
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Đăng nhập dành cho Khách hàng
      </h2>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Vui lòng nhập email" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Mật khẩu */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Vui lòng nhập mật khẩu" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Nút đăng nhập */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Đăng nhập
      </button>

      {/* Hoặc đăng nhập bằng Google */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors mt-4 font-medium"
      >
        Đăng nhập với Google
      </button>

      <div>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Bạn chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </a>
        </p>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Quên mật khẩu?{" "}
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Lấy lại mật khẩu
          </a>
        </p>
      </div>
    </form>
  </div>
);
};

export default ClientLogin;
