import { useParams } from "react-router-dom";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import { useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";
import { Divider } from "@mui/material";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { addToCart } from "../../redux/slice/cartSlice";

export type ProductVariant = {
  id: number;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  soldQuantity: number;
  price: number;
  imageUrls: string[];
};

export type ProductItemProps = {
  id: number;
  name: string;
  description: string;
  brand: string;
  material: string;
  category: any;
  variants: ProductVariant[];
};

const ProductDetail = () => {
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [tryonImage, setTryonImage] = useState<string | null>(null);
  const [isLoadingTryon, setIsLoadingTryon] = useState(false);

  const { id } = useParams();
  const [product, setProduct] = useState<ProductItemProps | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const imageListRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const cartRedux = useAppSelector((state) => state.cart);
  const [count, setCount] = useState(1); // Số lượng sản phẩm add to cart
  console.log("cartRedux Product", cartRedux);
  // Load dữ liệu sản phẩm
  const fetchProductDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/product/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch product detail");

      const data = await response.json();

      if (data.data) {
        setProduct(data.data);
        console.log("Product data:", data.data);
        // Nếu có variants, tự động chọn variant đầu tiên
        const firstVariant = data.data.variants?.[0];
        if (firstVariant) {
          setSelectedColor(firstVariant.colorName);
          setSelectedVariant(firstVariant);
          setSelectedImage(firstVariant.imageGroup?.image_urls?.[0] ?? null);
        }
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };

  console.log("product", product);

  console.log("setup", selectedColor, selectedVariant, selectedImage);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const handleColorSelect = (variant: ProductVariant) => {
    setSelectedColor(variant.colorName);
    setSelectedVariant(variant);

    // Chọn ảnh đầu tiên của variant
    if (variant.imageUrls?.length > 0) {
      setSelectedImage(variant.imageUrls[0]);
    }

    // Cuộn đến thumbnail đầu tiên của variant đã chọn
    setTimeout(() => {
      const thumb = imageListRef.current?.querySelector(
        `#thumb-${variant.id}-0`
      );
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const handleThumbnailClick = (url: string) => {
    setSelectedImage(url);
  };

  // Lọc variants theo màu đã chọn
  const selectedVariants =
    product?.variants?.filter((v) => v.colorName === selectedColor) || [];

  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  console.log("selectedVariant", selectedVariant);
  console.log("product", product);

  const handleAddToCart = (productVariantId: number, quantity: number) => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn sản phẩm trước khi thêm vào giỏ hàng");
      return;
    }
    if (quantity > selectedVariant.quantity) {
      toast.error("Số lượng sản phẩm không đủ");
      return;
    }
    dispatch(addToCart({ cartId: cartRedux.id, productVariantId, quantity }));
  };

  const handleTryOn = async () => {
    if (!personFile || !selectedImage) {
      toast.error("Vui lòng chọn đầy đủ ảnh");
      return;
    }

    try {
      setIsLoadingTryon(true);

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const contentType = response.headers.get("content-type") || "image/png";
      const extension = contentType.split("/")[1];
      const clothesFile = new File([blob], `clothes.${extension}`, {
        type: contentType,
      });

      const formData = new FormData();
      formData.append("person", personFile);
      formData.append("clothes", clothesFile);

      const res = await fetch("http://localhost:4000/tryon", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Kết quả thử đồ:", data);
      if (data.success) {
        // ✅ Không dùng .url nữa
        setTryonImage(data.tryonImage.url);
        toast.success("Thử đồ thành công!");
        console.log("Kết quả thử đồ:", data);
      } else {
        toast.error("Lỗi khi thử đồ");
      }
    } catch (err) {
      console.error("Lỗi thử đồ:", err);
      toast.error("Đã xảy ra lỗi khi gửi ảnh");
    } finally {
      setIsLoadingTryon(false);
    }
  };

  return (
    <LayoutClient>
      <div className="md:px-32 md:py-4 mt-8">
        <div className="grid grid-cols-12 ">
          {/* Hình ảnh */}
          <div className="col-span-6 grid grid-cols-4 gap-4">
            {/* Ảnh nhỏ */}
            <div className="col-span-1 bg-slate-50 overflow-y-auto max-h-[480px]">
              <div
                ref={imageListRef}
                className="flex flex-col w-full items-center space-y-4 p-2"
              >
                {product?.variants.map(
                  (variant) =>
                    variant.imageUrls?.map((url, idx) => (
                      <img
                        key={`${variant.id}-${idx}`}
                        id={`thumb-${variant.id}-${idx}`}
                        src={url}
                        alt={`${product?.name} - ${variant.colorName} - ${
                          idx + 1
                        }`}
                        onClick={() => {
                          handleThumbnailClick(url);
                        }}
                        className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                          selectedImage === url
                            ? "border-blue-500 border-2"
                            : "border-gray-300"
                        }`}
                      />
                    )) || []
                )}
              </div>
            </div>

            {/* Ảnh lớn */}
            <div className="col-span-3 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={`${product?.name} - ${selectedColor}`}
                  className="w-full h-auto max-h-[480px] object-contain rounded"
                />
              ) : (
                <img
                  src={product?.variants?.[0]?.imageUrls?.[0] || ""}
                  alt={`${product?.name} - ${selectedColor}`}
                  className="w-full h-auto max-h-[480px] object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="col-span-6 flex flex-col space-y-4 px-4">
            <h2 className="text-2xl font-bold">{product?.name}</h2>

            {/* Giá */}
            {selectedVariant && (
              <div className="text-xl font-semibold text-red-600">
                {formatPrice(selectedVariant.price)}
              </div>
            )}

            {/* Thông tin cơ bản */}
            <div className="space-y-2 mt-4">
              <p>
                <span className="font-semibold">Thương hiệu:</span>{" "}
                {product?.brand}
              </p>
              <p>
                <span className="font-semibold">Chất liệu:</span>{" "}
                {product?.material}
              </p>
              <p className="mt-2">{product?.description}</p>
            </div>

            {/* Màu sắc */}
            <div className="mt-6">
              <p className="font-bold mb-2">Màu sắc:</p>
              <div className="flex flex-wrap gap-2">
                {product?.variants
                  ?.filter(
                    (v, i, arr) =>
                      arr.findIndex(
                        (item) => item.colorName === v.colorName
                      ) === i
                  )
                  ?.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center cursor-pointer"
                      onClick={() => handleColorSelect(variant)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === variant.colorName
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: `#${variant.colorHex}` }}
                        title={variant.colorName}
                      ></div>
                      <span className="ml-1 text-sm">{variant.colorName}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Kích thước */}
            {selectedColor && (
              <div className="mt-4">
                <p className="font-bold mb-2">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                  {product?.variants
                    ?.filter((v) => v.colorName === selectedColor)
                    ?.map((variant) => (
                      <div
                        key={variant.id}
                        className={`px-4 py-2 border rounded cursor-pointer ${
                          selectedVariant?.id === variant.id
                            ? "border-black bg-gray-100"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {variant.size}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Số lượng */}
            {selectedVariant && (
              <div className="mt-4">
                <p className="font-bold mb-2">
                  Số lượng có sẵn: {selectedVariant.quantity}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 w-1/6 border rounded justify-evenly">
              <div className="">
                <button
                  onClick={() => {
                    if (count > 1) {
                      setCount(count - 1);
                    }
                  }}
                  disabled={count <= 1}
                >
                  -
                </button>
              </div>
              <div className="">{count}</div>
              <div className="">
                <button onClick={() => setCount(count + 1)}>+</button>
              </div>
            </div>

            {/* Nút thêm vào giỏ hàng */}
            <div className="mt-6">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={!selectedVariant || selectedVariant.quantity <= 0}
                onClick={() => {
                  if (selectedVariant) {
                    handleAddToCart(Number(selectedVariant.id), count);
                  }
                }}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Divider className=""></Divider>
        </div>

        <div className="w-full mt-4">
          <p className="flex items-center justify-center text-xl font-bold">
            Thử đồ trực tuyến
          </p>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          {/* Upload ảnh người dùng */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPersonFile(file);
                setPersonPreview(URL.createObjectURL(file));
                toast.info("Đã chọn ảnh cá nhân");
              }
            }}
          />

          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={handleTryOn}
            disabled={isLoadingTryon || !personFile || !selectedImage}
          >
            {isLoadingTryon ? "Đang xử lý..." : "Thử đồ ngay"}
          </button>

          {/* 3 Ảnh hiển thị hàng ngang */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Ảnh quần áo */}
            <div className="text-center">
              <p className="mb-2 font-medium">Ảnh quần áo</p>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Ảnh quần áo"
                  className="w-[200px] h-[250px] object-contain border rounded mx-auto"
                />
              ) : (
                <div className="w-[200px] h-[250px] border rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  Chưa chọn ảnh
                </div>
              )}
            </div>

            {/* Ảnh người */}
            <div className="text-center">
              <p className="mb-2 font-medium">Ảnh của bạn</p>
              {personPreview ? (
                <img
                  src={personPreview}
                  alt="Ảnh người dùng"
                  className="w-[200px] h-[250px] object-contain border rounded mx-auto"
                />
              ) : (
                <div className="w-[200px] h-[250px] border rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  Chưa upload ảnh
                </div>
              )}
            </div>

            {/* Ảnh kết quả */}
            <div className="text-center">
              <p className="mb-2 font-medium">Kết quả</p>
              {tryonImage ? (
                <img
                  src={tryonImage}
                  alt="Kết quả thử đồ"
                  className="w-[200px] h-[250px] object-contain border rounded mx-auto"
                />
              ) : (
                <div className="w-[200px] h-[250px] border rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  Chưa có kết quả
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutClient>
  );
};

export default ProductDetail;
