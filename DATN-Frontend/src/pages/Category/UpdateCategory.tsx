import { Category } from ".";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

export type UpdateCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    parentId: number | null;
    slug: string | null;
  }) => void;
  categories: Category[]; // danh sách hiện tại để chọn làm parent
  initialData: {
    name: string;
    parentId: number | null;
    slug: string | null;
  };
};

export function UpdateCategoryDialog({
  open,
  onClose,
  onSubmit,
  categories,
  initialData,
}: UpdateCategoryDialogProps) {
  const [name, setName] = useState(initialData.name);
  const [parentId, setParentId] = useState<number | null>(initialData.parentId);
  const [slug, setSlug] = useState(initialData.slug);
  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      parentId: parentId === null ? null : parentId,
      slug: slug?.trim() ?? null,
    });
    setName("");
    setParentId(null);
    onClose();
  };
  useEffect(() => {
    setName(initialData.name);
    setParentId(initialData.parentId);
  }, [initialData]); // cập nhật khi selectedCategory thay đổi
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Category</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          label="Parent Category"
          value={parentId ?? ""}
          onChange={(e) =>
            setParentId(e.target.value ? Number(e.target.value) : null)
          }
          fullWidth
        >
          <MenuItem value="">None</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Slug"
          fullWidth
          type="text"
          variant="outlined"
          value={slug ?? ""}
          onChange={(e) => setSlug(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Chỉnh sửa
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateCategoryDialog;
