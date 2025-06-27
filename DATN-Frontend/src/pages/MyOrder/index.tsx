import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import LayoutClient from "../../components/layout/Client/LayoutClient";

import SidebarClient from "../../components/ui/SidebarClient";

import { useEffect, useState } from "react";
import { customFetch } from "../../features/customFetch";
import ModalDetail from "./ModalDetail";

const BASE_URL = import.meta.env.VITE_API_URL;

interface Order {
  id: string | number;
  payment_method: string;
  shipping_address: string;
  status: string;
  items?: any;
  // Add other fields as needed
}

const MyOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentOrders = orders.slice(start, end);
  const fetchMyOrders = async () => {
    const response = await customFetch(`${BASE_URL}/api/order/my-orders`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      setOrders(data);
    }
    console.log(data);
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleOpen = (order: Order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  if (!orders) return <p>Loading...</p>;
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <LayoutClient>
      <div className="grid grid-cols-12 gap-4 md:px-32 md:py-4">
        <div className="col-span-3  h-[200px]">
          <SidebarClient />
        </div>
        <div className="col-span-9">
          <Typography variant="h5" gutterBottom>
            Danh sách đơn hàng
          </Typography>
          {orders.length > 0 ? (
            <TableContainer
              sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      borderBottom: "1px solid #ccc",
                      backgroundColor: "#ccc",
                    }}
                  >
                    <TableCell align="center" sx={{ width: "5%" }}>
                      ID
                    </TableCell>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      Ảnh
                    </TableCell>
                    <TableCell align="center" sx={{ width: "12%" }}>
                      Số lượng sản phẩm
                    </TableCell>
                    <TableCell align="center" sx={{ width: "15%" }}>
                      Phương thức thanh toán
                    </TableCell>
                    <TableCell align="center" sx={{ width: "30%" }}>
                      Địa chỉ
                    </TableCell>
                    <TableCell align="center" sx={{ width: "10%" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell align="center" sx={{ width: "20%" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Dữ liệu đơn hàng sẽ được lặp qua đây */}
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell align="center" sx={{ width: "5%" }}>
                        {order.id}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "20%" }}>
                        <p>Ảnh</p>
                      </TableCell>
                      <TableCell align="center" sx={{ width: "12%" }}>
                        {/* Số lượng sản phẩm có thể được tính toán từ order.items nếu có */}
                        {order.items ? order.items.length : 0}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "15%" }}>
                        {order.payment_method}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "30%" }}>
                        {order.shipping_address}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "10%" }}>
                        {order.status}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "20%" }}>
                        <button
                          onClick={() => handleOpen(order)}
                          className="text-blue-500 hover:underline"
                        >
                          Xem chi tiết
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
            </TableContainer>
          ) : (
            <p>Không có đơn hàng nào.</p>
          )}
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(orders.length / itemsPerPage)} // tổng số trang
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
          <ModalDetail
            open={open}
            onClose={handleClose}
            order={selectedOrder}
          />
        </div>
      </div>
    </LayoutClient>
  );
};

export default MyOrder;
