
import { AppDataSource } from "../data-source";
import { ProductVariant } from "../entities/ProductVariant";

export class ProductVariantRepository {
  private repo = AppDataSource.getRepository(ProductVariant);

  //lấy chi tiết sản phẩm theo ID
  async findById(id: number): Promise<ProductVariant | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["product",],
    });
  }

  async findByProductId(productId: number): Promise<ProductVariant[]> {
    return this.repo.find({
      where: { product: { id: productId } },
      
    });
  }

  //tạo sản phẩm mới
  async create(
    productVariant: Partial<ProductVariant>
  ): Promise<ProductVariant> {
    const newProductVariant = this.repo.create(productVariant);
    return await this.repo.save(newProductVariant);
  }

  //cập nhật biến thể theo Id
  async update(id: number, updateData: Partial<ProductVariant>): Promise<void> {
    await this.repo.update(id, updateData);
  }

  //xóa biến thể theo Id
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
  async save(productVariant: ProductVariant): Promise<ProductVariant> {
    return await this.repo.save(productVariant);
  }

  async getAvailableSize(): Promise<string[]> {
    const result = await this.repo
      .createQueryBuilder("ProductVariant")
      .select("DISTINCT ProductVariant.size")
      .orderBy("ProductVariant.size", "ASC")
      .getRawMany();

    return result.map((item) => item.size);
  }

  async getAvailableColor(): Promise<
    { colorName: string; colorHex: string }[]
  > {
    const result = await this.repo
      .createQueryBuilder("ProductVariant")
      .select("DISTINCT ProductVariant.colorName")
      .orderBy("ProductVariant.colorName", "ASC")
      .getRawMany();

    console.log("Available colors:", result);
    return result.map((item) => ({
      colorName: item.colorName,
      colorHex: item.colorHex,
    }));
  }

  async getMaxPrice(): Promise<any> {
    const result = await this.repo
      .createQueryBuilder("ProductVariant")
      .select("MAX(ProductVariant.price)", "maxPrice")
      .getRawOne();

    return result.maxPrice;
  }
}
