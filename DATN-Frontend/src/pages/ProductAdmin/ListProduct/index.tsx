import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Pagination,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashBoardLayout from "../../../components/layout/Dashboard/LayoutDB";
import { customFetch } from "../../../features/customFetch";
import ConfirmDeleteDialog from "../Dialog/DeleteProduct";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  material: string;
  category: {
    id: number;
    name: string;
  };
  variants: {
    id: number;
    size: string;
    colorName: string;
    price: number;
    quantity: number;
    colorHex: string;
    imageUrls: string[];
  }[];
}

interface Category {
  id: number;
  name: string;
}

const ListProduct = () => {
  //khai báo state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const limit = 10;
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";

  const navigate = useNavigate();

  //Hàm edit sản phẩm
  const handleEdit = (id: number) => {
    navigate(`/product-admin/edit/${id}`);
  };

  const fetchProducts = async () => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) query.append("search", search);
    if (categoryId) query.append("categoryId", categoryId);

    const res = await fetch(`${BASE_URL}/api/product?${query.toString()}`);
    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch products:", data);
      return;
    }

    setProducts(data.data.data);
    setTotalPages(Math.ceil(data.data.total / limit));
  };

  const fetchCategories = async () => {
    const res = await fetch(`${BASE_URL}/api/category`);
    const data = await res.json();
    if (res.ok) setCategories(data.data);
  };

  //Hàm xóa sản phẩm
  const handleDelete = async () => {
    if (selectedProductId === null) return;

    const res = await customFetch(
      `${BASE_URL}/api/product/delete/${selectedProductId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    if (res.ok) {
      fetchProducts();
      toast.success("Xóa sản phẩm thành công");
    } else {
      toast.error(data.message)
      console.error("Xóa thất bại:", data);
    }

    setConfirmOpen(false);
    setSelectedProductId(null);
  };

  //   useEffect(() => {
  //     fetchCategories();
  //   }, []);

  //  //Lấy danh sách sản phẩm
  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId]);

  const handlePageChange = (_: any, value: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", value.toString());
      return newParams;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("search", e.target.value);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("categoryId", e.target.value as string);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const calculateQuantity = (variants: Product["variants"]) =>
    variants.reduce((sum, v) => sum + v.quantity, 0);

  const getThumbnail = (variants: Product["variants"]) =>
    variants[0]?.imageUrls?.[0] || "/placeholder.jpg";

  return (
    <DashBoardLayout>
      <Box mb={2} display="flex" gap={2}>
        <div className="flex w-1/2">
          <TextField
            label="Tìm kiếm tên sản phẩm"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={categoryId}
            label="Danh mục"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(products) &&
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Avatar
                      src={getThumbnail(product.variants)}
                      variant="rounded"
                    />
                  </TableCell>
                  <TableCell>{calculateQuantity(product.variants)}</TableCell>
                  <TableCell>
                    {product.variants.map((v, idx) => (
                      <Box
                        key={idx}
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          display: "inline-block",
                          bgcolor: v.colorHex,
                          mr: 0.5,
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setConfirmOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </DashBoardLayout>
  );
};

export default ListProduct;
