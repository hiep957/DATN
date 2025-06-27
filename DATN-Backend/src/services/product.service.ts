import { ILike } from "typeorm";

import { Product } from "../entities/Product";
// import { ProductImageGroup } from "../entities/ProductImageGroup";
import { CreateProductInput, UpdateProductInput } from "../interfaces/Product";
import { CategoryRepository } from "../repositories/category.repo";
import { ProductRepository } from "../repositories/product.repo";
// import { ProductImageGroupRepository } from "../repositories/product_image_group.repo";
import { ProductVariantRepository } from "../repositories/product_variant.repo";
import { BadRequestError } from "../utils/ApiError";
import { AppDataSource } from "../data-source";

export class ProductService {
  private productRepo = new ProductRepository();
  private categoryRepo = new CategoryRepository(); // Assuming you have a CategoryRepository
  // private imageGroupRepository = new ProductImageGroupRepository(); // Assuming you have a ProductImageGroupRepository
  private productVariantRepo = new ProductVariantRepository();
  async getProductById(id: number) {
    console.log("getProductById", id);
    const product: any = await this.productRepo.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getProductVariantById(id: number) {
    console.log("getProductVariantById", id);
    const productVariant: any = await this.productVariantRepo.findById(id);
    if (!productVariant) {
      throw new Error("Product variant not found");
    }
    return productVariant;
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findById(id);
    console.log("product", product);

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    // Xóa tất cả các biến thể liên quan trước khi xóa sản phẩm
    if (product.variants && product.variants.length > 0) {
      await Promise.all(
        product.variants.map(async (variant) => {
          console.log("Deleting variant", variant.id);
          await this.productVariantRepo.delete(variant.id);
        })
      );
    }

    // Sau khi xóa biến thể, mới xóa sản phẩm
    const productDeleted = await this.productRepo.delete(id);
    return productDeleted;
  }

  async createProduct(productData: CreateProductInput) {
    const { name, description, brand, material, categoryId, variants } =
      productData;
    const existingProduct = await this.productRepo.findProductByName(name);
    if (existingProduct) {
      throw new BadRequestError("Product with this name already exists");
    }
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new BadRequestError("Category not found");
    }
    console.log("category trong Create Product Service", category);
    const product = new Product();
    product.name = name;
    product.description = description;
    product.brand = brand;
    product.material = material;
    product.category = category; // Assuming you have a Category entity

    await this.productRepo.save(product); // Save the product first to get the ID

    const imageGroupMap = new Map<string, any>();

    for (const v of variants) {
      // let imageGroup = null;

      // if (v.colorName && v.imageUrls && v.imageUrls.length > 0) {
      //   if (imageGroupMap.has(v.colorName)) {
      //     imageGroup = imageGroupMap.get(v.colorName)!;
      //   } else {
      //     imageGroup = await this.imageGroupRepository.create({
      //       image_urls: v.imageUrls,
      //       colorName: v.colorName,
      //       variants: [],
      //       id: 0,
      //     });
      //     await this.imageGroupRepository.save(imageGroup);
      //     imageGroupMap.set(v.colorName, imageGroup);
      //   }
      // }

      const productVariant = await this.productVariantRepo.create({
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        quantity: v.quantity,
        price: v.price,
        imageUrls: v.imageUrls, // Assuming imageUrls is an array of strings
        product: product, // Associate the variant with the product
      });
      await this.productVariantRepo.save(productVariant);
    }
    return product; // Return the created product
  }

  async editProduct(productId: number, data: UpdateProductInput) {
    // 1. Tìm sản phẩm theo ID và load quan hệ category + variants
    const existingProduct = await this.productRepo.findById(productId);

    if (!existingProduct) {
      throw new BadRequestError("Product not found");
    }

    // 2. Cập nhật các trường cơ bản của sản phẩm
    existingProduct.name = data.name;
    existingProduct.description = data.description;
    existingProduct.brand = data.brand;
    existingProduct.material = data.material;

    // 3. Cập nhật danh mục nếu khác
    if (data.categoryId !== existingProduct.category.id) {
      const category = await this.categoryRepo.findById(data.categoryId);
      if (!category) throw new BadRequestError("Category not found");
      existingProduct.category = category;
    }

    // 4. Lưu sản phẩm sau khi chỉnh sửa
    await this.productRepo.save(existingProduct);

    // 5. Tải danh sách variant hiện có từ DB (kèm imageGroup)
    const existingVariants = await this.productVariantRepo.findByProductId(
      productId
    );

    // 6. Tạo tập hợp ID từ biến thể mới gửi lên
    const incomingIds = new Set(data.variants.map((v) => v.id).filter(Boolean));
    const existingIds = new Set(existingVariants.map((v) => v.id));

    // 7. Xoá các variant cũ mà không còn trong danh sách mới
    for (const v of existingVariants) {
      if (!incomingIds.has(v.id)) {
        await this.productVariantRepo.delete(v.id);
      }
    }

    // 8. Chuẩn bị map imageGroup để dùng lại theo colorName
    // const imageGroupMap = new Map<string, ProductImageGroup>();

    for (const v of data.variants) {
      // let imageGroup: ProductImageGroup | null = null;

      // 9. Xử lý imageGroup theo colorName
      // if (v.colorName && v.imageUrls && v.imageUrls.length > 0) {
      //   if (imageGroupMap.has(v.colorName)) {
      //     imageGroup = imageGroupMap.get(v.colorName)!;
      //   } else {
      //     imageGroup =
      //       (await this.imageGroupRepository.findOneByColor(v.colorName)) ||
      //       null;

      //     if (!imageGroup) {
      //       imageGroup = await this.imageGroupRepository.create({
      //         colorName: v.colorName,
      //         image_urls: v.imageUrls,
      //         variants: [],
      //         id: 0,
      //       });
      //       await this.imageGroupRepository.save(imageGroup);
      //     }

      //     imageGroupMap.set(v.colorName, imageGroup);
      //   }
      // }

      // 10. Nếu có ID → cập nhật
      if (v.id && existingIds.has(v.id)) {
        const variant = existingVariants.find((x) => x.id === v.id)!;
        variant.size = v.size;
        variant.colorName = v.colorName;
        variant.colorHex = v.colorHex;
        variant.quantity = v.quantity;
        variant.price = v.price;
        // if (imageGroup) {
        //   variant.imageGroup = imageGroup;
        // }
        variant.imageUrls = v.imageUrls; // Assuming imageUrls is an array of strings

        await this.productVariantRepo.save(variant);
      } else {
        // 11. Không có ID → tạo mới
        const newVariant = await this.productVariantRepo.create({
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          quantity: v.quantity,
          price: v.price,
          // imageGroup: imageGroup ?? undefined,
          imageUrls: v.imageUrls, // Assuming imageUrls is an array of strings
          product: existingProduct,
        });

        await this.productVariantRepo.save(newVariant);
      }
    }

    // 12. Trả lại sản phẩm đã cập nhật (tuỳ ý)
    return existingProduct;
  }

  async getAllProducts(query: any) {
    const repo = AppDataSource.getRepository(Product);
    const {
      page = 1,
      limit = 10,
      search,
      category,
      size,
      color,
      minPrice,
      maxPrice,
    } = query;
    let categoryIds: number[] = [];
    //Xử lý slug, nếu có slug, lấy danh mục cha và các danh mục con
    if (category) {
      const parentCategory = await this.categoryRepo.findById2(category);
      console.log("parentCategory", parentCategory);
      //nếu có danh mục cha thì lấy danh mục cha và các danh mục con
      categoryIds = await this.categoryRepo.getAllChildCategoryIds(
        parentCategory.id
      );
      console.log("categoryIds", categoryIds);
    }

    const sizeArray =
      typeof size === "string"
        ? size.split(",").map((s: string) => s.trim())
        : [];

    const colorArray =
      typeof color === "string"
        ? color.split(",").map((c: string) => c.trim())
        : [];

    const queryBuilder = repo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.variants", "variant")
      // .leftJoinAndSelect("variant.imageGroup", "imageGroup");

    if (search) {
      queryBuilder.andWhere("product.name ILIKE :search", {
        search: `%${search}%`,
      });
    }
    if (categoryIds.length > 0) {
      console.log("categoryIds", categoryIds);
      queryBuilder.andWhere("category.id IN (:...ids)", {
        ids: categoryIds,
      });
    }

    if (sizeArray.length > 0) {
      queryBuilder.andWhere("variant.size IN (:...sizes)", {
        sizes: sizeArray,
      });
    }
    if (colorArray.length > 0) {
      queryBuilder.andWhere("variant.colorName IN (:...colors)", {
        colors: colorArray,
      });
    }

    // ✅ Lọc theo khoảng giá
    if (minPrice) {
      console.log("minPrice", parseFloat(minPrice));
      queryBuilder.andWhere("variant.price >= :minPrice", {
        minPrice: parseFloat(minPrice),
      });
    }

    if (maxPrice) {
      console.log("maxPrice", parseFloat(maxPrice));
      queryBuilder.andWhere("variant.price <= :maxPrice", {
        maxPrice: parseFloat(maxPrice),
      });
    }
    queryBuilder
      .orderBy("product.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);
    const [products, total] = await queryBuilder.getManyAndCount();
    return { data: products, total: total, page: +page, limit: +limit };
  }

  //lay danh sach mau
  async getAvailableSize() {
    const result = await this.productVariantRepo.getAvailableSize();
    return result;
  }

  async getAvailableColor() {
    const result = await this.productVariantRepo.getAvailableColor();
    return result;
  }

  async getMaxPrice() {
    const result = await this.productVariantRepo.getMaxPrice();
    return result;
  }

  async decreaseVariantQuantity(id: number, quantity: number) {
    const variant = await this.productVariantRepo.findById(id);
    if (!variant) {
      throw new BadRequestError("Variant not found");
    }
    if (variant.quantity < quantity) {
      throw new BadRequestError("Not enough stock");
    }
    variant.quantity -= quantity;
    variant.soldQuantity += quantity; // Tăng số lượng đã bán
    const updatedVariant = await this.productVariantRepo.save(variant);
    return updatedVariant; // Trả về biến thể đã cập nhật
  }

  async checkVariantQuantity(id: number, quantity: number) {
    const variant = await this.productVariantRepo.findById(id);
    if (!variant) {
      throw new BadRequestError("Variant not found");
    }
    if (variant.quantity < quantity) {
      console.log("Not enough stock for variant", id);
      return false; // Not enough stock
    }
    return true; // Enough stock
  }
}

//sản phẩm bán nhiều
// sản phẩm bán chạy
// san phẩm mới

//return { data: products, total: total, page: +page, limit: +limit };
