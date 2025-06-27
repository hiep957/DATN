import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { set, useForm } from "react-hook-form";
import { ProductVariant } from "../../../types/Product";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function VariantDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (variant: ProductVariant) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductVariant>({
    defaultValues: {
      size: "",
      colorName: "",
      colorHex: "",
      quantity: 0,
      price: 0,
      imageUrls: [],
    },
  });
  const [test, setTest] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const onSubmit = (data: ProductVariant) => {
    onSave({
      ...data,
      imageUrls: uploadedUrls,
    });
    reset();
    setUploadedUrls([]);
  };

  const handleClose = () => {
    reset();
    setUploadedUrls([]);
    onClose();
  };

  //upload image
  const uploadFile = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file)); // field name là "images"

    const res = await fetch(`${BASE_URL}/api/product/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    
    // Convert fileIds to accessible image URLs
    return data.detailImagePaths.map(
      (id: string) => `http://localhost:3000${id}`
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    console.log("Selected files:", files);
    setUploading(true);

    try {
      const newUrls = await uploadFile(Array.from(files));
      console.log("Uploaded URLs:", newUrls);
      const updatedUrls = [...uploadedUrls, ...newUrls];
      setUploadedUrls(updatedUrls);
      setValue("imageUrls", updatedUrls);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url: string) => {
    setUploadedUrls((prev) => prev.filter((item) => item !== url));
    setValue("imageUrls", uploadedUrls.filter((item) => item !== url));
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form>
        <DialogTitle className="my-2">Thêm biến thể</DialogTitle>
        <DialogContent>
          <TextField
            label="Size"
            fullWidth
            margin="dense"
            {...register("size", { required: "Vui lòng nhập size" })}
            error={!!errors.size}
            helperText={errors.size?.message}
          />
          <TextField
            label="Tên màu"
            fullWidth
            margin="dense"
            {...register("colorName", { required: "Vui lòng nhập tên màu" })}
            error={!!errors.colorName}
            helperText={errors.colorName?.message}
          />
          <TextField
            label="Mã màu (hex)"
            fullWidth
            margin="dense"
            {...register("colorHex", { required: "Vui lòng nhập mã màu" })}
            error={!!errors.colorHex}
            helperText={errors.colorHex?.message}
          />
          <TextField
            label="Số lượng"
            type="number"
            fullWidth
            margin="dense"
            {...register("quantity", {
              required: "Vui lòng nhập số lượng",
              valueAsNumber: true,
            })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />
          <TextField
            label="Giá"
            type="number"
            fullWidth
            margin="dense"
            {...register("price", {
              required: "Vui lòng nhập giá",
              valueAsNumber: true,
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          {/* <TextField
            label="Ảnh (URL, cách nhau bởi dấu phẩy)"
            fullWidth
            margin="dense"
            {...register("imageUrls")}
          /> */}
          <Button variant="outlined" component="label" disabled={uploading}>
            {uploading ? "Đang tải ảnh..." : "Chọn ảnh để upload"}
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {uploadedUrls.length > 0 && (
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {uploadedUrls.map((url, i) => (
                <img
                  onClick={() => handleRemoveImage(url)}
                  key={i}
                  src={url}
                  alt={`Ảnh ${i}`}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
