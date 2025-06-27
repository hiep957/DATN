import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

// ========== TYPES ==========
export type ProductItemProps = {
  id: number;
  name: string;
  description: string;
  brand: string;
  material: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  price: number;
  soldQuantity: number;
  imageUrls?: string[];
};

const ProductItem = (props: ProductItemProps) => {
  if (!props || !props.variants || props.variants.length === 0) {
    console.error("Invalid product data", props);
    return <div className="text-red-500">Invalid product data</div>;
  }
  console.log("ProductItem", props);
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    props.variants[0]
  );
  const quantitySell = props.variants.reduce(
    (total, variant) => total + (variant.soldQuantity || 0),
    0
  );
  console.log("quantitySell", quantitySell);
  return (
    <div className="bg-white  rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col space-y-2 relative">
      <img
        src={selectedVariant.imageUrls?.[0] || "src/assets/davies.jpg"}
        alt={props.name}
        className="w-full h-64 object-cover rounded-t cursor-pointer"
        onClick={() => {
          navigate(`/products/${props.id}`);
        }}
      />

      <h3 className="px-4 text-lg font-semibold text-gray-800">{props.name}</h3>

      <div className="px-4 flex justify-between items-center">
        <div className="flex gap-2">
          {props.variants.slice(0, 3).map((variant) => (
            <label key={variant.id}>
              <input
                type="radio"
                name={`variant-${props.id}`}
                className="hidden"
                onChange={() => setSelectedVariant(variant)}
              />
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedVariant.id === variant.id
                    ? "border-slate-500 "
                    : "border-gray-300"
                } transition-transform duration-150`}
                style={{ backgroundColor: `#${variant.colorHex}` }}
              />
            </label>
          ))}
        </div>

        <div>Add to cart</div>
      </div>

      <p className="px-4">
        <span className="text-red-500 font-semibold text-base">200000</span>Đ
      </p>

      <div className="px-4 flex justify-between text-sm text-gray-600">
        <span>⭐ 4.8 / 5</span>
        <span>Đã bán: {quantitySell}</span>
      </div>
    </div>
  );
};

export default ProductItem;
