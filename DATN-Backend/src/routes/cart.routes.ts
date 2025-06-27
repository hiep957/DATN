import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CartController } from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

// lấy giỏ hàng active của người dùng
// cập nhật trạn thái giỏ hàng
// xóa giỏ hàng

router.post(
  "/create-cart",
  verifyToken,
  asyncHandler(CartController.createCart)
);
router.get(
  "/get-cart",
  verifyToken,
  asyncHandler(CartController.getCart)
);
router.post(
  "/add-to-cart",
  verifyToken,
  asyncHandler(CartController.addToCart)
);
router.put(
  "/update-cart-item/:cartItemId",
  verifyToken,
  asyncHandler(CartController.updateQuantity)
);

router.delete(
  "/remove-cart-item/:cartItemId",
  verifyToken,
  asyncHandler(CartController.removeItem)
);

router.post(
  "/decrease-quantity/:cartItemId",
  asyncHandler(CartController.decreaseQuantity)
);
//thêm sản phẩm vào giỏ hàng
//cập nhật số lượng sản phẩm trong giỏ hàng
//xóa 1 sản phẩm giỏ hàng
//lấy tất cả các sản phẩm trong giỏ hàng
//

export default router;
