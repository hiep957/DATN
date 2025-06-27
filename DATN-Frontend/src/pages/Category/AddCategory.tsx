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
import { useState } from "react";

export type AddCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    parentId: number | null;
    slug: string | null;
  }) => void;
  categories: Category[]; // danh sách hiện tại để chọn làm parent
};

export function AddCategoryDialog({
  open,
  onClose,
  onSubmit,
  categories,
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      parentId: parentId === null ? null : parentId,
      slug: slug.trim(),
    });
    setName("");
    setParentId(null);
    setSlug("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Category</DialogTitle>
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
          fullWidth
          value={parentId ?? ""}
          onChange={(e) =>
            setParentId(e.target.value ? Number(e.target.value) : null)
          }
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
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddCategoryDialog;
