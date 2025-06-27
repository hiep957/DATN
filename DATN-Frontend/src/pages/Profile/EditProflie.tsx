// components/EditProfileDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
  };
  onSubmit: (data: any) => void;
}

const EditProfileDialog = ({
  open,
  onClose,
  defaultValues,
  onSubmit,
}: EditProfileDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Cập nhật thông tin</DialogTitle>
      <DialogContent className="space-y-4 mt-2 w-lg">
        <div className="mt-2">
          <TextField
            fullWidth
            label="First Name"
            {...register("firstName", { required: "Không được bỏ trống" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            
          />
        </div>

        <div>
          <TextField
            fullWidth
            label="Last Name"
            {...register("lastName", { required: "Không được bỏ trống" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </div>
        <div>
          <TextField
            fullWidth
            label="Số điện thoại"
            {...register("phoneNumber")}
          />
        </div>

        <div>
          <TextField fullWidth label="Địa chỉ" {...register("address")} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
