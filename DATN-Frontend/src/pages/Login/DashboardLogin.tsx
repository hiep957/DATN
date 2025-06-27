import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { loginUser } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Form Data:", data);
    const resultAction = await dispatch(loginUser(data));
    console.log("resultAction: ", resultAction);
    const role = resultAction.payload.role || "";

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("user trong login sau khi đăng nhập", user);
      console.log(loginUser.fulfilled.match(resultAction));
      if (role === "admin") {
        toast.success("Đăng nhập thành công");
        navigate("/dashboard");
      } else {
        toast.error("Chỉ admin mới có quyền truy cập vào trang này");
        console.log("Bạn không có quyền truy cập vào trang này");
        navigate("/");
      }
    } else {
      console.log("Login failed: ", resultAction.error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Đăng nhập trang quản trị
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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
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
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default LoginDashboard;
