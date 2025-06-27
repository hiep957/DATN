// EditProduct.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashBoardLayout from "../../../components/layout/Dashboard/LayoutDB";
import ProductForm from "./ProductForm";
import { ProductFormValues } from "../../../types/Product";
import { toast } from "react-toastify";
import { customFetch } from "../../../features/customFetch";
import { ProductVariant } from "../../Product/ProductDetail";

const EditProduct = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<ProductFormValues | null>(
    null
  );
  console.log("ID sản phẩm:", id);
  const [optionCategories, setOptionCategories] = useState<any[]>([]);
  const [treeCategories, setTreeCategories] = useState<any[]>([]);

  const extractLevel3Categories = (data: any) => {
    const result: { category: string; id: number }[] = [];

    data.forEach((level1: any) => {
      level1.children.forEach((level2: any) => {
        level2.children.forEach((level3: any) => {
          result.push({
            category: `${level3.name}`,
            id: level3.id,
          });
        });
      });
    });

    return result;
  };
  const fetchProduct = async () => {
    try {
      const res = await customFetch(`http://localhost:3000/api/product/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const productData = data.data;
      if (!data || typeof data !== "object")
        throw new Error("Dữ liệu sản phẩm không hợp lệ");

      const formatted = {
        ...productData,
        categoryId: productData.category?.id || null,
        variants: Array.isArray(productData.variants)
          ? productData.variants.map((v: ProductVariant) => ({
              id: v.id,
              size: v.size,
              colorName: v.colorName,
              colorHex: v.colorHex,
              quantity: v.quantity,
              price: v.price,
              imageUrls: v.imageUrls || [],
            }))
          : [],
      };

      setInitialData(formatted);
      console.log("Dữ liệu sản phẩm:", data);
    } catch (err) {
      toast.error("Không tải được dữ liệu sản phẩm");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log("Đang tải danh mục...");
        const res = await customFetch(
          "http://localhost:3000/api/category/categories/tree",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const categoriesRes = await res.json();
        if (res.ok && Array.isArray(categoriesRes.data)) {
          setTreeCategories(categoriesRes.data);

          // Lấy danh mục cấp 3 sau khi đã có tree
          const level3Categories = extractLevel3Categories(categoriesRes.data);
          setOptionCategories(level3Categories);
          console.log("Danh sách danh mục cấp 3:", level3Categories);
        }

        // Sau khi danh mục xong mới gọi fetch sản phẩm
        await fetchProduct();
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        toast.error("Không thể tải dữ liệu danh mục hoặc sản phẩm");
      }
    };

    if (id) {
      fetchAll();
    }
  }, [id]);

  const handleUpdate = async (data: ProductFormValues) => {
    console.log("Dữ liệu cập nhật:", data);
    try {
      const res = await customFetch(
        `http://localhost:3000/api/product/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (res.ok) {
        fetchProduct();
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật sản phẩm");
      console.error(err);
    }
  };

  if (!initialData || optionCategories.length === 0)
    return <div>Đang tải dữ liệu...</div>;

  return (
    <DashBoardLayout>
      <div className="flex flex-col px-6 py-4">
        <div className="text-xl font-medium mb-4">Chỉnh sửa sản phẩm</div>
        <div className="bg-white rounded shadow">
          <ProductForm
            defaultValues={initialData}
            onSubmit={handleUpdate}
            optionCategories={optionCategories}
          />
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default EditProduct;
