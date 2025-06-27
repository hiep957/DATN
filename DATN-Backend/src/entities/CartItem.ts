// entities/CartItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => ProductVariant, { eager: true })
  productVariant: ProductVariant;

  @Column({ type: "int", default: 1 })
  quantity: number;


}
