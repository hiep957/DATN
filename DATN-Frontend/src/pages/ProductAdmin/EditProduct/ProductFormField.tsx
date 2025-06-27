// ProductFormFields.tsx
import { Button, MenuItem, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../../types/Product";
import { useEffect, useState } from "react";
import { customFetch } from "../../../features/customFetch";

type Props = {
  optionCategories?: any[];
  defaultValues?: ProductFormValues;
};

export default function ProductFormFields({
  optionCategories,
  defaultValues,
}: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  console.log("GetValues trong ProductFormFields", getValues());  
  // console.log(
  //   "Giá trị optionCategories trong ProductFormFields",
  //   optionCategories
  // );

  const text = defaultValues?.category.name;
  console.log("Giá trị text", text);
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

      <div className="flex w-full ">
        <div className="flex flex-col w-full">
          {!isOpenSelect ? (
            <TextField
              label="Danh mục hiện tại"
              className="w-1/2"
              margin="normal"
              value={text}
            ></TextField>
          ) : (
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
              {optionCategories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            className="w-1/6 font-light"
            variant="outlined"
            onClick={() => setIsOpenSelect((prev) => !prev)}
          >
            {isOpenSelect ? "Đóng" : "Thay đổi danh mục"}
          </Button>
        </div>
      </div>
    </>
  );
}
