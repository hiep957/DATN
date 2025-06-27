import { google, drive_v3 } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const KEYFILEPATH = "./google-service.json";
const FOLDER_ID = "1kVQAKzkg2upet-ZCJJ3HfFAlb2OudOFL"; // thư mục chứa ảnh

export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });

    this.drive = google.drive({ version: "v3", auth });
  }

  public async uploadFile(filePath: string, fileName: string): Promise<string> {
    try {
      console.log("KEYFILEPATH", KEYFILEPATH);
      const fileMetadata = {
        name: fileName,
        parents: [FOLDER_ID],
      };

      const media = {
        mimeType: "application/octet-stream",
        body: fs.createReadStream(filePath),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      const fileId = response.data.id;
      console.log(`File uploaded successfully: ${fileId}`);

      // ✅ Cấp quyền công khai ngay sau khi upload
      if (fileId) {
        await this.shareFile(fileId);
      } else {
        throw new Error("File ID is undefined after upload.");
      }

      // Xoá file local sau khi upload
      fs.unlinkSync(filePath);

      return fileId!;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  public async uploadMultipleFiles(
    files: { filePath: string; fileName: string }[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.filePath, file.fileName)
    );

    return Promise.all(uploadPromises);
  }

  public async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({ fileId });
      console.log(`File ${fileId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  public async listFiles(): Promise<drive_v3.Schema$File[] | undefined> {
    try {
      const response = await this.drive.files.list({ pageSize: 10 });
      console.log("Files in Drive:", response.data.files);
      return response.data.files || [];
    } catch (error) {
      console.error("Error listing files:", error);
    }
  }

  public async shareFile(fileId: string): Promise<void> {
    try {
      await this.drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
      });
      console.log(`File ${fileId} is now public.`);
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  }
}
