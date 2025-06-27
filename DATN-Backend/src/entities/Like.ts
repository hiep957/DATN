// src/entities/Like.ts
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Like {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Product, (product) => product.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;

  @CreateDateColumn()
  likedAt: Date;
}
