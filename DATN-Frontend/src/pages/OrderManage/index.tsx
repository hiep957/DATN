import { useEffect, useState } from "react";
import DashBoardLayout from "../../components/layout/Dashboard/LayoutDB";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { customFetch } from "../../features/customFetch";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const orderStatuses = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đã giao hàng" },
  { value: "delivered", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
  { value: "refunded", label: "Hoàn tiền" },
  { value: "failed", label: "Thất bại" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  pending: "warning",
  paid: "success",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
  refunded: "primary",
  failed: "error",
};

type Order = {
  id: string;
  status: string;
  payment_method: string;
  shipping_address: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user: any;
  items: OrderItem[];
};

type OrderItem = {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string;
  productVariant: any;
};

const OrderManage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogOrder, setDialogOrder] = useState<Order | null>(null);
  const handleOpenDialog = (order: Order) => {
    setDialogOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogOrder(null);
  };
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const payment_method = searchParams.get("payment_method") || "";

  const fetchOrder = async () => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });
    if (status) {
      query.append("status", status);
    }
    if (payment_method) {
      query.append("payment_method", payment_method);
    }
    const res = await fetch(
      `${BASE_URL}/api/order/get-all?${query.toString()}`,
      {
        method: "GET",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("data", data.data);
      setOrders(data.data.data);
      setTotalPages(data.data.total); // Assuming 10 items per page
    } else {
      console.error("Failed to fetch orders:", data);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [searchParams]);
  console.log("orders", orders);

  const handlePageChange = (_: any, value: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", value.toString());
      return newParams;
    });
  };

  const updateStatusByOrderId = async (orderId: string, status: string) => {
    console.log("updateStatusByOrderId", orderId, status);
    const res = await customFetch(
      `${BASE_URL}/api/order/update-status/${orderId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    if (res.ok) {
      toast.success("Cập nhật trạng thái thành công");
      console.log("Cập nhật trạng thái thành công", data);
      fetchOrder(); // Refresh the order list
    } else {
      console.error("Cập nhật trạng thái thất bại:", data);
    }
  };

  return (
    <DashBoardLayout>
      <div className="flex flex-col space-y-2">
        <Typography variant="h5">Order Management</Typography>
        <p>This is the order management page.</p>
        <div>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              label="Trạng thái"
              value={status}
              onChange={(e) => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.set("status", e.target.value as string);
                  newParams.set("page", "1");
                  return newParams;
                });
              }}
            >
              <MenuItem value="" color="default">
                Tất cả
              </MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="processing">Đang xử lý</MenuItem>
              <MenuItem value="shipped">Đã giao hàng</MenuItem>
              <MenuItem value="delivered">Hoàn tất</MenuItem>
              <MenuItem value="cancelled">Đã huỷ</MenuItem>
              <MenuItem value="refunded">Hoàn tiền</MenuItem>
              <MenuItem value="failed">Thất bại</MenuItem>
            </Select>
          </FormControl>
        </div>

        {orders.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  borderBottom: "1px solid #ccc",
                  backgroundColor: "#ccc",
                }}
              >
                <TableCell align="center" sx={{ width: "10%" }}>
                  Mã đơn hàng
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  Tên sản phẩm
                </TableCell>
                <TableCell align="center" sx={{ width: "15%" }}>
                  Họ tên người mua
                </TableCell>
                <TableCell align="center" sx={{ width: "12%" }}>
                  Phương thức thanh toán
                </TableCell>
                <TableCell align="center" sx={{ width: "20%" }}>
                  Trạng thái đơn hàng
                </TableCell>
                <TableCell align="center" sx={{ width: "15%" }}>
                  Ngày tạo
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell align="center">{order.id}</TableCell>
                  <TableCell align="center">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => handleOpenDialog(order)}
                      >
                        {item.product_name}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => handleOpenDialog(order)}
                  >
                    {order.user.firstName + " " + order.user.lastName}
                  </TableCell>
                  <TableCell align="center">{order.payment_method}</TableCell>
                  <TableCell align="center">
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          updateStatusByOrderId(order.id, e.target.value)
                        }
                        displayEmpty
                      >
                        {orderStatuses.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <Chip
                              label={opt.label}
                              color={statusColorMap[opt.value] || "default"}
                              size="small"
                              //   variant="outlined"
                              sx={{ width: "100%" }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  <TableCell align="center">
                    {dayjs(order.created_at).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p> Không có đơn hàng nào</p>
        )}
        <div className="flex justify-center mt-4">
          <Pagination
            count={Math.ceil(totalPages / 10)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin đơn hàng</DialogTitle>
        <DialogContent dividers>
          {dialogOrder && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                👤 Người mua: {dialogOrder.user.firstName}{" "}
                {dialogOrder.user.lastName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                📍 Địa chỉ giao hàng: {dialogOrder.shipping_address}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                💳 Phương thức thanh toán: {dialogOrder.payment_method}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                🧾 Tổng tiền: {dialogOrder.total_amount.toLocaleString()}đ
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1">🛍️ Sản phẩm:</Typography>
              <List dense>
                {dialogOrder.items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={`${item.product_name} x${item.quantity}`}
                      secondary={`Đơn giá: ${item.price.toLocaleString()}đ`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </DashBoardLayout>
  );
};

export default OrderManage;
