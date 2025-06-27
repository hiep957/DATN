import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Typography,
  Paper,
  TableContainer,
  Button,
  CircularProgress,
  Collapse,
  styled,
} from "@mui/material";

import DashBoardLayout from "../../components/layout/Dashboard/LayoutDB";
import { customFetch } from "../../features/customFetch";
import AddCategoryDialog from "./AddCategory";
import { toast } from "react-toastify";
import { Update } from "@mui/icons-material";
import UpdateCategoryDialog from "./UpdateCategory";

export type Category = {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  } | null;
  children?: Category[];
  products?: any[];
  slug?: string|null;
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Mock dữ liệu

// Component chính
const Category = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await customFetch(
        `${BASE_URL}/api/category/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.data);
      console.log("Category", data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddCategory = async (data: {
    name: string;
    parentId: number | null;
    slug: string | null;
  }) => {
    // Gọi API để tạo danh mục mới
    try {
      const response = await customFetch(
        `${BASE_URL}/api/category/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            slug: data.slug ?? "", // convert null slug to empty string or handle as needed
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      const newCategory = await response.json();
      fetchCategory(); // Cập nhật danh sách danh mục sau khi thêm mới
      console.log("New category created:", newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setOpenAddDialog(false);
    }
    console.log("Adding category:", data);
  };

  const handleupdateCategory = async (
    id: string,
    data: { name: string; parentId: number | null; slug: string | null }
  ) => {
    try {
      const response = await customFetch(
        `${BASE_URL}/api/category/categories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      const updatedCategory = await response.json();
      toast.success("Cập nhật danh mục thành công");
      fetchCategory(); // Cập nhật danh sách danh mục sau khi sửa đổi
      console.log("Category updated:", updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setOpenEditDialog(false);
    }
    console.log("Updating category:", data);
  };

  const handleDeleteCategory = async (id: number) => {
    console.log("Deleting category with ID:", id);
    try {
      const response = await customFetch(
        `${BASE_URL}/api/category/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      fetchCategory(); // Cập nhật danh sách danh mục sau khi xóa
      toast.success("Xóa danh mục thành công");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setOpenEditDialog(true);
  };

  if (loading) {
    return (
      <DashBoardLayout>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </Paper>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout>
      <Paper sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Quản lý Danh mục</Typography>
          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            + Thêm mới
          </Button>
          <AddCategoryDialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            onSubmit={handleAddCategory}
            categories={categories}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Danh mục cha</TableCell>
                <TableCell>Số sản phẩm</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.parent ? cat.parent.name : "—"}</TableCell>
                  <TableCell>{cat.products?.length ?? 0}</TableCell>
                  <TableCell>{cat.slug ? cat.slug : "—"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenEdit(cat)}>Sửa</Button>

                    <Button color="error" onClick={() => handleDeleteCategory(cat.id)}>Xoá</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedCategory && (
          <UpdateCategoryDialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            onSubmit={(data) =>
              handleupdateCategory(selectedCategory.id.toString(), data)
            }
            categories={categories}
            initialData={{
              name: selectedCategory.name,
              parentId: selectedCategory.parent?.id ?? null,
              slug: selectedCategory.slug?.trim() ?? null,
            }}
          />
        )}
      </Paper>
    </DashBoardLayout>
  );
};

export default Category;
