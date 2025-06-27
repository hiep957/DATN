// ========== TYPES ==========
export type ProductFormValues = {
  name: string;
  description: string;
  brand: string;
  material: string;
  categoryId: number;
  variants: ProductVariant[];
  category?: any;
  optionCategories?: any[];
};

export type ProductVariant = {
  id: number;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  price: number;
  imageUrls: string[];
};
