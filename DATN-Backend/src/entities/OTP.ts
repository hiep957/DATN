// src/entities/Otp.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otpCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;
}
