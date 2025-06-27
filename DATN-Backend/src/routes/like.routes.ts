import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { LikeController } from "../controllers/like.controller";
import { asyncHandler } from "../utils/asyncHandler";




const router = Router();
const likeController = new LikeController();
router.get("/", (req, res) => {
  res.send("Get all likes");
});

router.post("/create", asyncHandler(likeController.createLike));
router.get("/product/:productId", asyncHandler(likeController.getLikeByProduct));
export default router;