import { TextField, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../../types/Product";
import { useEffect, useState } from "react";
import { customFetch } from "../../../features/customFetch";

export default function ProductFormFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const [optionCategories, setOptionCategories] = useState<any[]>([]);
  const [treeCategories, setTreeCategories] = useState<any[]>([]);
  useEffect(() => {
    const fetchCategoriesTree = async () => {
      try {
        const res = await customFetch(
          "http://localhost:3000/api/category/categories/tree",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTreeCategories(data.data);
        }
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    fetchCategoriesTree();
  }, []);

  useEffect(() => {
    if (treeCategories.length > 0) {
      const level3Categories = extractLevel3Categories(treeCategories);
      setOptionCategories(level3Categories);
      console.log("Danh mục cấp 3:", level3Categories);
    }
  }, [treeCategories]);

  const extractLevel3Categories = (data: any) => {
    const result: { category: string; id: number }[] = [];

    data.forEach((level1: any) => {
      level1.children.forEach((level2: any) => {
        level2.children.forEach((level3: any) => {
          result.push({
            category: `${level1.name} > ${level2.name} > ${level3.name}`,
            id: level3.id,
          });
        });
      });
    });

    return result;
  };
  return (
    <>
      <div className="flex w-full gap-2">
        <TextField
          label="Tên sản phẩm"
          {...register("name", {
            required: "Tên sản phẩm là bắt buộc",
            minLength: {
              value: 3,
              message: "Tên sản phẩm phải có ít nhất 3 ký tự",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mô tả"
          {...register("description", {
            required: "Mô tả là bắt buộc",
            minLength: {
              value: 10,
              message: "Mô tả phải có ít nhất 10 ký tự",
            },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
          margin="normal"
          required={true}
        />
      </div>

      <div className="flex w-full gap-2">
        <TextField
          label="Thương hiệu"
          {...register("brand")}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chất liệu"
          {...register("material")}
          fullWidth
          margin="normal"
        />
      </div>
      <div className="flex w-full gap-2">
        <TextField
          className="w-1/2"
          select
          label="Danh mục"
          {...register("categoryId", {
            required: "Danh mục là bắt buộc",
          })}
          error={!!errors.categoryId}
          helperText={errors.categoryId?.message}
          margin="normal"
        >
          {optionCategories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.category}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </>
  );
}
