import { useEffect, useState } from "react";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import { ProductItemProps } from "../Product/ProductDetail";
import { useLocation } from "react-router-dom";
import ProductItem from "../../components/layout/Client/ProductItem";

const SearchPage = () => {
  const [products, setProducts] = useState<ProductItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const searchParams = useQuery();
  console.log("searchParams", searchParams.get("keyword"));
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/product/search?keyword=${searchParams.get(
          "keyword"
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams.get("keyword")]);
  console.log("Products:", products);
  return (
    <LayoutClient>
      <p className="px-32 mt-2">
        Có {products.length} sản phẩm tìm thấy với từ khóa:{" "}
        {searchParams.get("keyword")}
      </p>
      {/* Add your search functionality here */}
      <div className="md:px-32 md:py-4 grid grid-cols-5 gap-4">
        {products && (
            products.map((product) => (
                <ProductItem
                    key={product.id}
                    {...product}
                    variants={product.variants.map((variant) => ({
                        ...variant,
                        id: String(variant.id),
                    }))}
                />
            ))
        )}
      </div>
    </LayoutClient>
  );
};

export default SearchPage;
