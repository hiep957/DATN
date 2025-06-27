import { useEffect, useState } from "react";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import FilterSidebar from "../../components/ui/product/FilterSideBar";
import Sidebar from "../../components/ui/Sidebar";
import { useFilterParams } from "../../hooks/useFilterParams";
import { useLocation } from "react-router-dom";
import ProductItem, {
  ProductItemProps,
} from "../../components/layout/Client/ProductItem";

const ProductList = () => {
  const { filters } = useFilterParams();

  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  console.log("queryParams", location.search);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/product${location.search}`,
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
      console.log("Data:", data.data);
      setProducts(data.data.data || []);
      setData(data.data);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Data products:", products);
  useEffect(() => {
    fetchProducts();
  }, [location.search]);
  return (
    <LayoutClient>
      <div className="md:px-32 md:py-4 grid grid-cols-12 gap-4">
        {/* Sidebar lọc */}
        <div className="col-span-2">
          <FilterSidebar />
        </div>

        {/* Danh sách sản phẩm */}
        <main className="col-span-10 bg-slate-100 p-4 rounded shadow">
          <h2 className="font-bold text-lg mb-4">Sản phẩm</h2>
          <div className="my-2">Có tổng cộng {data?.total} sản phẩm</div>

          {loading && <div className="text-gray-500">Đang tải...</div>}

          {!loading && products.length === 0 && (
            <div className="text-gray-500">Không có sản phẩm nào.</div>
          )}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {products.map((product: ProductItemProps) => (
                <ProductItem key={product.id} {...product} />
              ))}

              {/* ... */}
            </div>
          )}
        </main>
      </div>
    </LayoutClient>
  );
};

export default ProductList;
