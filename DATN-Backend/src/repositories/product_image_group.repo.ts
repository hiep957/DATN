
// import { AppDataSource } from "../data-source";
// import { ProductImageGroup } from "../entities/ProductImageGroup";

// export class ProductImageGroupRepository {
//   private repo = AppDataSource.getRepository(ProductImageGroup);
//   async save(productImageGroup: ProductImageGroup): Promise<ProductImageGroup> {
//     return await this.repo.save(productImageGroup);
//   }

//   async create(
//     productImageGroup: ProductImageGroup
//   ): Promise<ProductImageGroup> {
//     const newProductImageGroup = this.repo.create(productImageGroup);
//     return await this.repo.save(newProductImageGroup);
//   }

//   async findOneByColor(colorName: string): Promise<ProductImageGroup | null> {
//     return await this.repo.findOne({
//       where: { colorName },
//     });
//   }
// }
