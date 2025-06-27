import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";

export class ProductRepository {
  private repo = AppDataSource.getRepository(Product);

  //lấy chi tiết sản phẩm theo ID
  async findById(id: number): Promise<Product | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["category", "variants"],
    });
  }

  async findProductByName(name: string): Promise<Product | null> {
    return await this.repo.findOne({
      where: { name },
    });
  }

  //tạo sản phẩm mới
  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.repo.create(product);
    return await this.repo.save(newProduct);
  }

  /**
   * Cập nhật sản phẩm theo ID
   */
  async update(id: number, updateData: Partial<Product>): Promise<void> {
    await this.repo.update(id, updateData);
  }

  /**
   * Xóa sản phẩm theo ID
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async save(product: Product): Promise<Product> {
    return await this.repo.save(product);
  }
}
