import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { logoutAPI, signIn, signUp } from "../api";

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string; // Optional, default is "user"
};

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// 👉 Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData: LoginType, { rejectWithValue }) => {
    try {
      const response = await signIn(loginData); // gọi API
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData: RegisterType, { rejectWithValue }) => {
    try {
      const response = await signUp(registerData); // gọi API
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

// 👉 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { clearError, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
