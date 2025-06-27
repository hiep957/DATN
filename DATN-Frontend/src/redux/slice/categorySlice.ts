import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../../pages/Category";
import { create } from "@mui/material/styles/createTransitions";
import { getCategoryTree } from "../api";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async () => {
    try {
      const data = await getCategoryTree();

      return data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const { setCategories, setLoading, setError, clearError } =
  categorySlice.actions;

export default categorySlice.reducer;
