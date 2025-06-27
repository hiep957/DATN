
import { TextField } from "@mui/material";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../types/Product";

// ========== INPUT COMPONENTS ==========
const InputField = ({ name, label, required }: { name: keyof ProductFormValues; label: string; required: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <TextField
      label={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message as string}
      fullWidth
      margin="normal"
      required={required}
    />
  );
};

export default InputField;