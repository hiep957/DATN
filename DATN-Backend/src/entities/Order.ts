// src/entities/Order.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
    import { User } from "./User";
  import { OrderItem } from "./OrderItem";
  
  @Entity()
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.orders, { nullable: false })
    user: User;
  
    @Column({ default: "pending" })
    status: string; // pending, paid, shipped, delivered, cancelled
  
    @Column({ nullable: true })
    payment_method: string; // cash, vnpay, paypal
  
    @Column("text", { nullable: true })
    shipping_address: string;
  
    @Column("numeric", { precision: 12, scale: 2 })
    total_amount: number;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
  }
  