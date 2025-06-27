export type OrderInput = {
  cartItemId: string[];
  userId: number;
  shipping_address?: string;
  total_amount?: number;
  items: {
    productVariantId: number;
    product_name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
};
