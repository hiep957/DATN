// entities/Product.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./Category";
import { ProductVariant } from "./ProductVariant";
import { Like } from "./Like";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column()
  brand: string;

  @Column()
  material: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => Like, (like) => like.product)
  likes: Like[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
