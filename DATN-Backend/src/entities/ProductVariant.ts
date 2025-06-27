// entities/ProductVariant.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";
// import { ProductImageGroup } from "./ProductImageGroup";

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column({ nullable: true })
  colorName: string;

  @Column({ default: 0 })
  soldQuantity: number;

  @Column({ nullable: true })
  colorHex: string;

  @Column({ nullable: true })
  quantity: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
  })
  price: number;
  @Column("text", { array: true, nullable: true })
  imageUrls: string[];

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  // @ManyToOne(() => ProductImageGroup, (group) => group.variants, {
  //   nullable: true,
  // })
  // imageGroup: ProductImageGroup;
}
