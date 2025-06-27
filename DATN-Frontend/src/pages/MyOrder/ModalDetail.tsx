// components/ui/ModalChiTietDonHang.tsx
import { Box, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface ProductVariant {
  name: string;
}

interface OrderItem {
  quantity: number;
  productVariant: ProductVariant;
}

interface Order {
  id: string | number;
  payment_method: string;
  shipping_address: string;
  status: string;
  items?: any[];
  total_amount?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const ModalDetail = ({ open, onClose, order }: Props) => {
  const navigate = useNavigate();
  const handleToSeeProuctDetail = (id: number) => {
    navigate(`/products/${id}`);
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Chi tiết đơn hàng #{order?.id}
        </Typography>
        <Typography>Phương thức thanh toán: {order?.payment_method}</Typography>
        <Typography>Địa chỉ: {order?.shipping_address}</Typography>
        <Typography>Trạng thái: {order?.status}</Typography>
        <Typography sx={{}}>
          Tổng tiền:{" "}
          {parseFloat(order?.total_amount || "0").toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Typography>

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          Chi tiết sản phẩm:
        </Typography>
        <ul>
          {order?.items?.map((item, index) => (
            <li className="mt-2" key={index}>
              <div className="p-2 border grid grid-cols-5">
                <div className="col-span-1 flex items-center justify-center">
                  <img
                    src="/public/wibu.jpg"
                    alt={item.productVariant?.name}
                    className="w-24 h-24 object-cover"
                    onClick={() => handleToSeeProuctDetail(item.productVariant?.product.id)}
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-between">
                  <Typography variant="body2" className="flex items-center">
                    Tên sản phẩm: {item.productVariant?.product.name}
                  </Typography>
                  <Typography variant="body2" className="flex items-center">
                    Màu: {item.productVariant?.colorName}
                  </Typography>
                  <Typography variant="body2" className="flex items-center">
                    Size: {item.productVariant?.size}
                  </Typography>
                </div>
                <div className="col-span-2 flex flex-col justify-between">
                  <Typography variant="body2" className="flex items-center">
                    Giá tiền:{" "}
                    {parseFloat(
                      item.productVariant?.price || "0"
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={onClose} className="mt-4 text-red-500">
          Đóng
        </button>
      </Box>
    </Modal>
  );
};

export default ModalDetail;
