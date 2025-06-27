import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { loginUser, registerUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCart } from "../../redux/slice/cartSlice";
type RegisterFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
};

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //   const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

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

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log("Form Data:", data);
    data.role = "user"; // Set default role to 'user'

    const resultAction = await dispatch(registerUser(data));
    console.log("resultAction: ", resultAction);

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Đăng ký thành công");
      navigate("/");
      try {
        await createCart(); // đợi tạo cart xong
        await dispatch(fetchCart()); // rồi mới fetch giỏ hàng
      } catch (error) {
        console.error("Lỗi khi tạo hoặc fetch cart:", error);
        toast.error("Đăng ký thành công nhưng lỗi khi tạo giỏ hàng.");
      }
    } else {
      toast.error(
        typeof resultAction.payload === "string"
          ? resultAction.payload
          : "Đăng ký thất bại"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Trang đăng ký
        </h2>

        <div className="flex flex-row space-x-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName", {
                required: "Vui lòng nhập họ",
                minLength: { value: 2, message: "Họ phải có ít nhất 2 ký tự" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", {
                required: "Vui lòng nhập tên",
                minLength: { value: 2, message: "Tên phải có ít nhất 2 ký tự" },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
            {...register("email", {
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            })}
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
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nhập lại mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu",
              validate: (value) =>
                value === watch("password") || "Mật khẩu không khớp",
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
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

        <div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Bạn đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
