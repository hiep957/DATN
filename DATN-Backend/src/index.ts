import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import errorHandlingMiddleware from "./middlewares/errorHandlingMiddleware";
import cors from "cors";
import { asyncHandler } from "./utils/asyncHandler";
import { PaymentController } from "./controllers/payment.controller";
// Load environment variables first
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS config: Cho phép frontend gửi request và nhận cookie
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend (Vite)
    credentials: true, // Cho phép gửi cookie
  })
);
// Đặt TRƯỚC express.json()

import { AppDataSource } from "./data-source";
import PayOS from "@payos/node";
import path from "path";

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
})
export const payosClient = new PayOS(
  "22e23c6d-fdaf-40f6-90f1-f8e4b5360b08",
  "052c7906-0a81-4e77-a87d-ac37a30f4b0a",
  "cadecea76162cde1b6b43a2f3d20ab8ae48281227dfc6a547ae4990f44362979"
);

// Initialize database before setting up routes
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully");

    // Import routes AFTER database connection is established
    const authRouter = require("./routes/auth.routes").default;
    const categoryRouter = require("./routes/category.routes").default;
    const productRouter = require("./routes/product.routes").default;
    const cartRouter = require("./routes/cart.routes").default;
    const orderRouter = require("./routes/order.routes").default;
    const paymentRouter = require("./routes/payment.routes").default;
    const likeRouter = require("./routes/like.routes").default;
    const vitonRouter = require("./routes/viton.routes").default;
    // Setup routes
    app.use("/api/auth", authRouter);
    app.use("/api/category", categoryRouter);
    app.use("/api/product", productRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/payment", paymentRouter);
    app.use("/api/like", likeRouter);
    app.use("/api/viton", vitonRouter);
    // Error handling middleware should be the last middleware
    app.use(errorHandlingMiddleware);
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    // Start server
    app.listen(port, function () {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error: any) => {
    console.log("Error connecting to database:", error);
    process.exit(1); // Exit with error
  });
