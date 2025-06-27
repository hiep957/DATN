import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { OrderController } from "../controllers/order.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkAdmin } from "../middlewares/checkAdmin";

const router = Router();
router.get("/get-all", asyncHandler(OrderController.listOrders));
router.put(
  "/update-status/:id",
  verifyToken,
  checkAdmin,
  asyncHandler(OrderController.updateOrderStatus)
);
router.post("/create", verifyToken, asyncHandler(OrderController.createOrder));
router.get(
  "/my-orders",
  verifyToken,
  asyncHandler(OrderController.getOrdersByUserId)
);
router.post(
  "/:id",
  verifyToken,
  checkAdmin,
  asyncHandler(OrderController.getOrderById)
);
router.put("/:id", asyncHandler(OrderController.updateOrder));
router.get(
  "/:orderId",
  verifyToken,
  asyncHandler(OrderController.getOrderById)
);

export default router;
