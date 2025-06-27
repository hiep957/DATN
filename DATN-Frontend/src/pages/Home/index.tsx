import { Divider, Typography } from "@mui/material";
import Header from "../../components/layout/Client/Header";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import SwiperComponent from "../../components/SwiperComponent";
import { Sparkles } from "lucide-react";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductItemProps } from "../Product/ProductDetail";
import ProductItem from "../../components/layout/Client/ProductItem";

// type Product = {
//   id: number;
//   name: string;
//   description: string;
//   brand: string;
//   material: string;
//   variants: {
//     id: number;
//     size: string;
//     colorName: string;
//     colorHex: string;
//     price: string;
//     quantity: number;
//     soldQuantity: number;
//     imageUrls: string[];
//   }[];
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
// };

const Home = () => {
  const [productNews, setProductNew] = useState<ProductItemProps[]>([]);
  const getProductNew = async () => {
    const response = await fetch(
      "http://localhost:3000/api/product/top10-new",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setProductNew(data);
    } else {
      console.error("Failed to fetch new products:", data);
    }
  };

  const [productBestSeller, setProductBestSeller] = useState<
    ProductItemProps[]
  >([]);
  const getProductBestSeller = async () => {
    const response = await fetch(
      "http://localhost:3000/api/product/top10-best-seller",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      setProductBestSeller(data);
    } else {
      console.error("Failed to fetch best-selling products:", data);
    }
  };

  useEffect(() => {
    getProductNew();
    getProductBestSeller();
  }, []);

  console.log("productNews", productNews);
  console.log("productBestSeller", productBestSeller);

  return (
    <LayoutClient>
      <SwiperComponent />

      <div className="px-32 mt-4">
        <Divider />
      </div>

      <div className="px-32 mt-4 ">
        <div className="flex flex-col">
          <p className="flex justify-center text-lg font-semibold">
            <Sparkles className="mr-2" color="red" />
            Sản phẩm mới ra mắt
          </p>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {productNews &&
              productNews.slice(0, 6).map((product) => (
                <ProductItem
                  key={product.id}
                  {...{
                    ...product,
                    variants: product.variants.map((variant) => ({
                      ...variant,
                      id: String(variant.id),
                    })),
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="px-32 mt-4">
        <Divider />
      </div>

      <div className="px-32 mt-4 ">
        <div className="flex flex-col">
          <p className="flex justify-center text-lg font-semibold">
            <Flame size={24} color="red" />
            Sản phẩm bán chạy
          </p>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {productBestSeller &&
              productBestSeller.slice(0, 7).map((product) => (
                <ProductItem
                  key={product.id}
                  {...{
                    ...product,
                    variants: product.variants.map((variant) => ({
                      ...variant,
                      id: String(variant.id),
                    })),
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="px-32 mt-4">
        <Divider />
      </div>
      {/* <div className="px-32 mt-4 ">
        <div className="flex flex-col">
          <p className="flex justify-center text-lg font-semibold">
            <Sparkles className="mr-2" color="red" />
            Sản phẩm được đánh giá cao
          </p>
        </div>
      </div> */}
      
    </LayoutClient>
  );
};

export default Home;
