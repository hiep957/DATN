import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { ProductVariant } from "../../../types/Product";

export default function VariantTable({ variants }: { variants: ProductVariant[] }) {
  return (
    <Table size="small" sx={{ mt: 2 }}>
      <TableHead>
        <TableRow>
          <TableCell>Size</TableCell>
          <TableCell>Màu</TableCell>
          <TableCell>Hex</TableCell>
          <TableCell>Số lượng</TableCell>
          <TableCell>Giá</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {variants.map((v, i) => (
          <TableRow key={i}>
            <TableCell>{v.size}</TableCell>
            <TableCell>{v.colorName}</TableCell>
            <TableCell>{v.colorHex}</TableCell>
            <TableCell>{v.quantity}</TableCell>
            <TableCell>{v.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
