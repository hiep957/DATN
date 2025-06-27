// ProductForm.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useForm, FormProvider, set } from "react-hook-form";

import VariantTable from "./VariantTable";
import VariantDialog from "./VariantDialog";
import { ProductFormValues, ProductVariant } from "../../../types/Product";
import ProductFormFields from "./ProductFormFields";
import VariantPreview from "./VariantPreview";
import { toast } from "react-toastify";
import { customFetch } from "../../../features/customFetch";

export default function ProductForm() {
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      material: "",
      categoryId: 0,
      variants: [],
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(null);

  const handleAddVariant = (variant: ProductVariant) => {
    setVariants((prev) => [...prev, variant]);
    setDialogOpen(false);
  };

  const onSubmit = async (data: ProductFormValues) => {
    data.variants = variants;

    console.log("Dữ liệu sản phẩm:", data);
    try {
      const res = await customFetch(
        "http://localhost:3000/api/product/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        console.log("Sản phẩm đã lưu:", result);
      } else {
        toast.error(result.message || "Lỗi khi lưu sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <Container
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{ maxWidth: 800, mx: "auto", p: 2 }}
      >
        <Typography variant="h5" mb={2}>
          Thuộc tính chung
        </Typography>

        <ProductFormFields />

        <Box mt={2} className="gap-2">
          <Typography variant="h5">Biến thể sản phẩm</Typography>
          <button onClick={() => setDialogOpen(true)} className="mb-4 p-2 bg-blue-500 text-white rounded">
            Thêm biến thể
          </button>
          {/** Tôi muốn ở đây hiển thị 1 bên là gallary ảnh, 1 bên hiển thị màu, size, số lượng, giá, bấm vào màu nào thì có thể hiển thị ảnh màu đó, và số lượng giá size */}
          <VariantPreview
            variants={variants}
            selectedVariantIndex={selectedVariantIndex}
            onSelectVariant={setSelectedVariantIndex}
            onDeleteVariant={(index) => {
              setVariants((prev) => prev.filter((_, i) => i !== index));
            }}
          />
        </Box>

        <Button variant="contained" type="submit" sx={{ mt: 4 }}>
          Lưu sản phẩm
        </Button>

        <VariantDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleAddVariant}
        />
      </Container>
    </FormProvider>
  );
}
