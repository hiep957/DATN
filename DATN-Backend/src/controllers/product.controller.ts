import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";
import { Request, Response } from "express";
import { ProductVariant } from "../entities/ProductVariant";

const productService = new ProductService();
export class ProductController {
  static async getProductById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log("getProductById", id);
    const product = await productService.getProductById(id);
    res
      .status(200)
      .json({ data: product, message: "Sản phẩm đã được tìm thấy" });
  }

  static async getProductVariantById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log("getProductVariantById", id);
    const productVariant = await productService.getProductVariantById(id);
    res.status(200).json({
      data: productVariant,
      message: "Biến thể sản phẩm đã được tìm thấy",
    });
  }

  static async createProduct(req: Request, res: Response) {
    const productData = req.body;
    console.log("createProduct", productData);
    const product = await productService.createProduct(productData);
    res.status(201).json({ data: product, message: "Sản phẩm đã được tạo" });
  }

  static async updateProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const productData = req.body;
    console.log("updateProduct", id, productData);
    await productService.editProduct(id, productData);
    const productInfo = await productService.getProductById(id);
    res.status(200).json({
      message: "Sản phẩm đã được cập nhật",
      data: normalizeData(productInfo),
    });
  }

  static async getAllProducts(req: Request, res: Response) {
    console.log("getAllProducts query", req.query);
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ data: result });
  }

  static async deleteProduct(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    console.log("deleteProduct", id);
    const result = await productService.deleteProduct(id);
    res.status(200).json({ message: "Sản phẩm đã được xóa", data: result });
  }

  static async getPropsForFilter(req: Request, res: Response) {
    const size = await productService.getAvailableSize();
    const color = await productService.getAvailableColor();
    const maxPrice = await productService.getMaxPrice();
    res.status(200).json({ data: { size, color, maxPrice } });
  }

  static async getNewProducts(req: Request, res: Response) {
    try {
      const productRepo = AppDataSource.getRepository(Product);

      const products = await productRepo.find({
        order: { createdAt: "DESC" },
        take: 10,
        relations: ["variants", "category"], // tùy bạn cần thêm gì
      });

      return res.json(products);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to get new products", error: err });
    }
  }

  static async getBestSellerProducts(req: Request, res: Response) {
    try {
      const variantRepo = AppDataSource.getRepository(ProductVariant);

      // Lấy tổng soldQuantity của các ProductVariant, nhóm theo productId
      const rawResult = await variantRepo
        .createQueryBuilder("variant")
        .select("variant.productId", "productId")
        .addSelect("SUM(variant.soldQuantity)", "totalSold")
        .groupBy("variant.productId")
        .orderBy("SUM(variant.soldQuantity)", "DESC") // ✅ Dùng biểu thức thay vì alias
        .limit(10)
        .getRawMany();

      const topProductIds = rawResult.map((r) => r.productId);

      if (topProductIds.length === 0) return res.json([]);

      const productRepo = AppDataSource.getRepository(Product);

      // Lấy thông tin chi tiết của các sản phẩm có trong topProductIds
      const products = await productRepo.find({
        where: { id: In(topProductIds) },
        relations: ["variants", "category"],
      });

      // Sắp xếp theo thứ tự tổng soldQuantity
      const sortedProducts = topProductIds.map((id) =>
        products.find((p) => p.id === parseInt(id))
      );

      return res.json(sortedProducts);
    } catch (error) {
      console.error("Error fetching top-selling products:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async searchProducts(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword?.toString().trim();

      if (!keyword) {
        return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm (q)" });
      }

      const productRepo = AppDataSource.getRepository(Product);

      const results = await productRepo
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.variants", "variant")
        .leftJoinAndSelect("product.category", "category")
        .where("LOWER(product.name) LIKE :keyword", {
          keyword: `%${keyword.toLowerCase()}%`,
        })
        .orWhere("LOWER(product.description) LIKE :keyword", {
          keyword: `%${keyword.toLowerCase()}%`,
        })
        .orderBy("product.createdAt", "DESC")
        .getMany();

      return res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ message: "Lỗi tìm kiếm sản phẩm" });
    }
  }
}

const normalizeData = (data: any) => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    brand: data.brand,
    material: data.material,
    categoryId: data.category.id, // Chuyển category thành categoryId
    variants: data.variants.map((variant: any) => ({
      id: variant.id,
      size: variant.size,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      quantity: variant.quantity,
      price: variant.price, // Nếu cần, có thể chuyển thành kiểu number nếu giá trị là số
      imageUrls: variant.imageGroup?.image_urls || variant.image_urls, // Chuyển đổi imageUrls từ imageGroup nếu có
    })),
  };
};
