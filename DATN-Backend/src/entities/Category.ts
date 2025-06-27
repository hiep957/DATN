// entities/Category.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Product } from "./Product";

//gom cac api sau
//

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "varchar", nullable: true })
  slug: string | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
