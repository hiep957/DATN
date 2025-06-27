// src/entities/OrderItem.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";

import { ProductVariant } from "./ProductVariant";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order: Order;

  @ManyToOne(() => ProductVariant, { eager: true })
  productVariant: ProductVariant;

  @Column()
  product_name: string; // tên tại thời điểm đặt hàng

  @Column("numeric", {
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  image: string;
}
