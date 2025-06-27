export interface VariantInput {
  size: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  price: number;
  imageUrls?: string[];
}

export interface CreateProductInput {
  name: string;
  description: string;
  brand: string;
  material: string;
  categoryId: number;
  variants: VariantInput[];
  createdAt?: Date; // Thêm trường createdAt nếu cần
}

export interface UpdateProductInput {
  name: string;
  description: string;
  brand: string;
  material: string;
  categoryId: number;
  variants: {
    id?: number; // Biến thể cũ có ID, mới thì không có
    size: string;
    colorName: string;
    colorHex: string;
    quantity: number;
    price: number;
    imageUrls: string[];
  }[];
}
