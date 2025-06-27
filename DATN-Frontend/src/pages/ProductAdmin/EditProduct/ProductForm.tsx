// ProductForm.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { ProductFormValues, ProductVariant } from "../../../types/Product";
import ProductFormFields from "./ProductFormField";
import VariantPreview from "./VariantPreview";
import VariantDialog from "./VariantDialog";

interface Props {
  defaultValues?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  optionCategories?: any[];
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  optionCategories,
}: Props) {
  const methods = useForm<ProductFormValues>({
    defaultValues: defaultValues || {
      name: "",
      description: "",
      brand: "",
      material: "",
      category: "",
      variants: [],
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(
    defaultValues?.variants || []
  );

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<
    number | null
  >(defaultValues?.variants?.[0]?.id || null);

  console.log("Giá trị default", defaultValues);

  const handleAddVariant = (variant: ProductVariant) => {
    setVariants((prev) => [...prev, variant]);
    // set vào varaint của form
    methods.setValue("variants", [...methods.getValues("variants"), variant]);
    setDialogOpen(false);
  };

  const handleDeleteVariant = (index: number) => {
    //set vào variants của form
    methods.setValue(
      "variants",
      methods.getValues("variants").filter((_, i) => i !== index)
    );
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const internalSubmit = async (data: ProductFormValues) => {
    // data.variants = variants;
    console.log("Dữ liệu sản phẩm trước khi gửi:", data);
    await onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <Container
        component="form"
        onSubmit={methods.handleSubmit(internalSubmit)}
        sx={{ maxWidth: 800, mx: "auto", p: 2 }}
      >
        <Typography variant="h5" mb={2}>
          Thuộc tính chung
        </Typography>

        <ProductFormFields
          optionCategories={optionCategories}
          defaultValues={defaultValues}
        />

        <Box mt={2}>
          <Typography variant="h5">Biến thể sản phẩm</Typography>
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(true)}
            sx={{ mt: 1 }}
          >
            Thêm biến thể
          </Button>

          <VariantPreview
            variants={variants}
            selectedVariantIndex={selectedVariantIndex}
            onSelectVariant={setSelectedVariantIndex}
            onDeleteVariant={handleDeleteVariant}
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
