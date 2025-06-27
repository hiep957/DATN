// entities/Cart.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";


@Entity()
export class Cart {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn() // Cart là bên sở hữu, chứa khóa ngoại userId
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
