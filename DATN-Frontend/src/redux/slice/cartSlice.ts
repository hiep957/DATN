import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductVariant } from "../../pages/Product/ProductDetail";
import { User } from "../../types/User";
import {
  addToCartAPI,
  decreaseQuantityAPI,
  getCart,
  removeItemAPI,
} from "../api";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  quantity: number;
  productVariant?: ProductVariant;
  
}

interface CartState {
  loadingStatus: "idle" | "loading" | "success" | "error";
  items: CartItem[];
  id: string;
  user: User | null;
}

const initialState: CartState = {
  loadingStatus: "idle",
  items: [],
  id: "",
  user: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await getCart();
  return response.data;
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      cartId,
      productVariantId,
      quantity,
    }: { cartId: string; productVariantId: number; quantity: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = await addToCartAPI(cartId, productVariantId, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      dispatch(fetchCart()); // cập nhật lại cart
      return data;
    } catch (error: any) {
      toast.error(error.message || "Thêm sản phẩm thất bại");
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseQuantityCart = createAsyncThunk(
  "cart/decreaseQuantityCart",
  async (
    { quantity, cartItemId }: { quantity: number; cartItemId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = await decreaseQuantityAPI(quantity, cartItemId);
      toast.success("Đã giảm số lượng sản phẩm trong giỏ hàng");
      dispatch(fetchCart()); // cập nhật lại cart
      return data;
    } catch (error: any) {
      toast.error(error.message || "Thêm sản phẩm thất bại");
      return rejectWithValue(error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (
    { cartItemId }: { cartItemId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const data = await removeItemAPI(cartItemId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      dispatch(fetchCart()); // cập nhật lại cart
      return data;
    } catch (error: any) {
      toast.error(error.message || "Xóa sản phẩm thất bại");
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.id = "";
      state.user = null;
      state.loadingStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loadingStatus = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loadingStatus = "success";
        state.items = action.payload.items;
        state.id = action.payload.id;
        state.user = action.payload.user;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loadingStatus = "error";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
