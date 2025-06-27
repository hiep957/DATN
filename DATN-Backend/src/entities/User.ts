// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Cart } from "./Cart";
import { Order } from "./Order";
import { Like } from "./Like";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: "local" })
  provider: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: "user" })
  role: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
