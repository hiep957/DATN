// // entities/ProductImageGroup.ts
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
// import { ProductVariant } from "./ProductVariant";

// @Entity()
// export class ProductImageGroup {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column("text", { array: true })
//   image_urls: string[];

//   // Thêm trường này để phân biệt nhóm ảnh theo màu
//   @Column()
//   colorName: string;

//   @OneToMany(() => ProductVariant, (variant) => variant.imageGroup, {
//     nullable: true,
//   })
//   variants: ProductVariant[];
// }
