import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ProductController } from "../controllers/product.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { checkAdmin } from "../middlewares/checkAdmin";
import multer from "multer";
// Cấu hình lưu trữ sử dụng diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Kiểm tra xem thư mục đã tồn tại chưa, nếu chưa thì tạo mới
    const UPLOAD_DIR = path.join(__dirname, "../images");
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR); // Đường dẫn lưu trữ file
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});
const router = Router();
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

// Router xử lý upload
router.post("/upload", upload.array("images", 10), async (req, res) => {
  console.log("req.files", req.files);

  const files = req.files;
  const detailImagePaths: string[] = [];

  // Lấy ra các file đã upload
  const imageFiles = files as Express.Multer.File[]; // Chuyển đổi kiểu dữ liệu
  console.log("imageFiles", imageFiles);

  if (imageFiles) {
    for (const file of imageFiles) {
      const filename = file.filename; // Đã được xử lý bởi multer
      const filepath = path.join(__dirname, "../images", filename);
      detailImagePaths.push(`/images/${filename}`); // Thêm đường dẫn file vào danh sách
    }
  }

  res.json({ success: true, detailImagePaths }); // Trả kết quả về client
});

router.post(
  "/create",
  // verifyToken,
  // checkAdmin,
  asyncHandler(ProductController.createProduct)
);
router.post("/:id", asyncHandler(ProductController.getProductById));
router.put(
  "/update/:id",
  // verifyToken,
  // checkAdmin,
  asyncHandler(ProductController.updateProduct)
);
router.get("/", asyncHandler(ProductController.getAllProducts));
router.delete(
  "/delete/:id",
  verifyToken,
  checkAdmin,
  asyncHandler(ProductController.deleteProduct)
);
router.get("/props", asyncHandler(ProductController.getPropsForFilter));
router.get(
  "/variant/:id",
  asyncHandler(ProductController.getProductVariantById)
);

router.get("/top10-new", asyncHandler(ProductController.getNewProducts));
router.get("/top10-best-seller", asyncHandler(ProductController.getBestSellerProducts));
router.get("/search", asyncHandler(ProductController.searchProducts));

export default router;
