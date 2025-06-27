// src/data-source.ts
import { DataSource } from "typeorm";
import { Order } from "./entities/Order";
import { User } from "./entities/User";
// Import các entity cần thiết

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "hieplaso1",
  database: "shopdb",
  entities: ["src/entities/*.ts"],
  synchronize: true,
});
