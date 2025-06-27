import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
const router = Router();
// Cấu hình multer: lưu ảnh tạm thời vào thư mục uploads/
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  upload.fields([
    { name: "person", maxCount: 1 },
    { name: "clothes", maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const personFile = (req.files as any)?.person?.[0];
      const clothesFile = (req.files as any)?.clothes?.[0];

      if (!personFile || !clothesFile) {
        res.status(400).json({ success: false, error: "Missing files" });
        return;
      }

      const personImage = fs.readFileSync(personFile.path);
      const clothesImage = fs.readFileSync(clothesFile.path);
      const { Client } = await import("@gradio/client");
      const appHF = await Client.connect("yisol/IDM-VTON");

      const result = await appHF.predict("/tryon", [
        { background: personImage, layers: [], composite: null },
        clothesImage,
        "Try this!",
        true,
        true,
        3,
        42,
      ]);

      // Xoá file tạm
      fs.unlinkSync(personFile.path);
      fs.unlinkSync(clothesFile.path);

      const data = result.data as any[];
      res.json({
        success: true,
        tryonImage: data[0],
        maskedImage: data[1],
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;
// This code defines a route for virtual try-on using the IDM-VTON model.
