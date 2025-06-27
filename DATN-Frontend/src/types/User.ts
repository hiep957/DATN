// 📁 src/types/User.ts

export interface User {
    id: number;
    firstName?: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    email: string;
    password?: string;        // Thường sẽ không được gửi từ BE → có thể bỏ
    provider: string;
    refreshToken?: string;    // Không nên dùng ở FE, có thể bỏ luôn nếu BE không trả
    role: 'user' | 'admin' | string;
    avatar?: string;
    carts?: any[];            // Hoặc định nghĩa type Cart nếu cần
  }
  