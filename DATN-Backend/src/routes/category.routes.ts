import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/verifyToken";
import { checkAdmin } from "../middlewares/checkAdmin";

const router = Router();

router.get("/categories", asyncHandler(CategoryController.getAll));
router.post("/categories",verifyToken, checkAdmin,  asyncHandler(CategoryController.create));
router.post("/categories/:id", asyncHandler(CategoryController.getById));
router.get("/categories/tree", asyncHandler(CategoryController.getTree));
router.get(
  "/categories/siblings/:id",
  asyncHandler(CategoryController.getSiblings)
);

router.put("/categories/:id", verifyToken, checkAdmin, asyncHandler(CategoryController.update));
router.delete("/categories/:id", verifyToken, checkAdmin, asyncHandler(CategoryController.delete));
export default router;
