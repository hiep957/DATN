import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyToken } from "../middlewares/verifyToken";
import { checkAdmin } from "../middlewares/checkAdmin";
import upload from "../utils/UploadFile/multerConfig";
import { BadRequestError } from "../utils/ApiError";
import { GoogleDriveService } from "../utils/UploadFile/GoogleDriveService";

const router = Router();
const controller = new AuthController();
// Trong auth.router.ts

router.get("/google", asyncHandler(controller.loginGoogleRedirect));
router.get("/google/callback", asyncHandler(controller.loginGoogleCallback));
router.post("/register", asyncHandler(controller.register));
router.post("/login", asyncHandler(controller.login));
router.get("/me", verifyToken, asyncHandler(controller.getUserInfo));
// update user info
router.put(
  "/me",
  verifyToken,
  upload.single("file"),
  asyncHandler(controller.updateMe)
);
router.get(
  "/isAdmin",
  verifyToken,
  checkAdmin,
  asyncHandler(controller.getUserInfo)
);
//12/4/2025
router.post("/refresh-token", asyncHandler(controller.refreshToken));
router.get("/logout", verifyToken, asyncHandler(controller.logout))

//test upload file
router.post(
  "/upload-single",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      console.log("req.file", req.file);
      const driveService = new GoogleDriveService();
      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }
      const filePath = req.file.path;
      const fileName = req.file.originalname;

      const fileId = await driveService.uploadFile(filePath, fileName);
      res.json({ success: true, fileId });
    } catch (error) {
      throw new BadRequestError("Error uploading file");
    }
  }
);
router.post(
  "/upload-multiple",
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    try {
      const driveService = new GoogleDriveService();
      const files = (req.files as Express.Multer.File[]).map((file) => ({
        filePath: file.path,
        fileName: file.originalname,
      }));

      const fileIds = await driveService.uploadMultipleFiles(files);
      res.json({ success: true, fileIds });
    } catch (error) {
      res.status(500).json({ error: "Multiple upload failed" });
    }
  }
);
router.get("/getUser", asyncHandler(controller.getUser));
router.post("/generate-otp", asyncHandler(controller.generateOTP));
router.post("/verify-otp", asyncHandler(controller.verifyOTP));
router.post(
  "/send-email-changepassword",
  asyncHandler(controller.sendOtpToEmail)
);
router.post("/change-password", asyncHandler(controller.changePassword));
export default router;
