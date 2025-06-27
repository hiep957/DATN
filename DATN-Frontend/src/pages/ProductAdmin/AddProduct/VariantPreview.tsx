import React from "react";
import { ProductVariant } from "../../../types/Product";

interface Props {
  variants: ProductVariant[];
  selectedVariantIndex: number | null;
  onSelectVariant: (index: number) => void;
  onDeleteVariant: (index: number) => void; // ✅ thêm prop mới
  
}

export default function VariantPreview({
  variants,
  selectedVariantIndex,
  onSelectVariant,
  onDeleteVariant,
}: Props) {
  const selectedVariant =
    selectedVariantIndex !== null
      ? variants[selectedVariantIndex]
      : variants[0];
  console.log("Selected variant:", selectedVariant);
  console.log("Variants:", variants);
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 flex flex-wrap gap-2">
        {selectedVariant?.imageUrls.map((url, i) => (
          <div key={i} className="w-48 h-48 overflow-hidden border rounded">
            <img
              src={url}
              alt={`Ảnh ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="w-full md:w-1/2">
        <div className="flex flex-wrap gap-2 mb-4">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                className={`px-3 py-1 rounded-full border ${
                  selectedVariantIndex === i
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => onSelectVariant(i)}
              >
                {v.colorName} - {v.size}
              </button>
              <button
                onClick={() => onDeleteVariant(i)}
                className="text-red-500 text-sm hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {selectedVariant && (
          <div className="space-y-2">
            <p>
              <strong>Size:</strong> {selectedVariant.size}
            </p>
            <p>
              <strong>Giá:</strong> {selectedVariant.price}
            </p>
            <p>
              <strong>Số lượng:</strong> {selectedVariant.quantity}
            </p>
            <p>
              <strong>Mã màu:</strong> {selectedVariant.colorHex}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
