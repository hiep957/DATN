import { toast } from "react-toastify";

// utils/customFetch.ts
export const customFetch = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const res = await fetch(input, {
    ...init,
    credentials: "include", // cần để gửi cookie
  });

  if (res.status === 401) {
    const data = await res.json();

    // Nếu lỗi do token thiếu hoặc hết hạn
    if (data.message === "Access token is missing" || data.message === "jwt expired") {
      const refresh = await fetch("http://localhost:3000/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refresh.ok) {
        toast.success("Đã làm mới access token!");
        // Nếu refresh thành công → gọi lại request ban đầu
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      } else {
        throw new Error("Refresh token failed");
      }
    }
  }

  return res;
};
