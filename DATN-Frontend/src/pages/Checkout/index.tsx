import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import { Container, Divider, Grid2 } from "@mui/material";
import { customFetch } from "../../features/customFetch";
import { OrderInput } from "../../types/Order";
import { toast } from "react-toastify";
import { createPaymentLink, updateOrderAPI } from "../../redux/api";
const Checkout = () => {
  const params = useParams();
  console.log("Checkout params:", params);
  if (!params.orderId) {
    console.error("Order ID is missing in params");
    return null; // Hoặc hiển thị thông báo lỗi
  }
  // State lưu dữ liệu tỉnh, quận, xã
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vietqr");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedHomeNumber, setSelectedHomeNumber] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [order, setOrder] = useState<OrderInput | null>(null);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^(?:\+84|0)[3|5|7|8|9]\d{8}$/;
  const navigate = useNavigate();
  const getOrder = async () => {
    const res = await customFetch(
      `http://localhost:3000/api/order/${params.orderId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("Order data: ", data);
      setOrder(data.data);
    } else {
      console.error("Error fetching order: ", data);
    }
  };

  useEffect(() => {
    getOrder();
  }, [params.id]);

  const getProvinceName = (provinceId: any) => {
    const province = provinces.find((p) => p.id === provinceId);
    return province ? province.name : "";
  };

  const getDistrictName = (districtId: any) => {
    const district = districts.find((d) => d.id === districtId);
    return district ? district.name : "";
  };

  const getWardName = (wardId: any) => {
    const ward = wards.find((w) => w.id === wardId);
    return ward ? ward.name : "";
  };

  const getAddress =
    selectedHomeNumber +
    ", " +
    getWardName(selectedWard) +
    ", " +
    getDistrictName(selectedDistrict) +
    ", " +
    getProvinceName(selectedProvince);

  // Lấy danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetch(
        "https://open.oapi.vn/location/provinces?page=0&size=63"
      );
      const data = await res.json();
      console.log("data: ", data);
      setProvinces(data.data || []);
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (!selectedProvince) return;
    const fetchDistricts = async () => {
      const res = await fetch(
        `https://open.oapi.vn/location/districts/${selectedProvince}`
      );
      const data = await res.json();
      setDistricts(data.data || []);
      setWards([]); // Reset wards khi tỉnh thay đổi
      setSelectedDistrict("");
      setSelectedWard("");
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchWards = async () => {
      const res = await fetch(
        `https://open.oapi.vn/location/wards/${selectedDistrict}`
      );
      const data = await res.json();
      setWards(data.data || []);
      setSelectedWard("");
    };
    fetchWards();
  }, [selectedDistrict]);

  const handleClickPayment = async () => {
    if (
      !selectedName ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !selectedHomeNumber ||
      !selectedEmail ||
      !selectedPhone
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin thanh toán");
      return;
    }
    const res = await updateOrderAPI(Number(params.orderId), getAddress);
    console.log("Update order response: ", res);
    if (!res) {
      toast.error("Cập nhật đơn hàng thất bại");
      return;
    }

    if (selectedPaymentMethod === "vietqr") {
      const res1 = await createPaymentLink(Number(params.orderId));
      if (!res1) {
        toast.error("Tạo liên kết thanh toán thất bại");
        return;
      }
      window.location.href = res1.data.checkoutUrl;
    }

    if (selectedPaymentMethod === "cod") {
      const res = await updateOrderAPI(
        Number(params.orderId),
        getAddress,
        "cod"
      );
      
      if (res.ok) {
        console.log("Order updated successfully");
        toast.success("Đơn hàng đã được tạo, vui lòng chờ xác nhận");
      } else {
        toast.error(res.message || "Cập nhật đơn hàng thất bại");
      }
    }
  };

  return (
    <LayoutClient>
      <Container maxWidth={false} sx={{ maxWidth: "1440px" }} className="mt-4">
        <Grid2 container columnSpacing={2}>
          <Grid2 size={7}>
            <div className="border rounded p-4 flex flex-col ">
              <p className="font-semibold text-xl">Thông tin thanh toán</p>
              <div className="mt-2">
                <label htmlFor="name">Họ và tên</label>
                <input
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border p-2"
                  placeholder="Mã Tiến Hiệp"
                />
              </div>

              <div className="flex flex-row w-full space-x-2">
                {/* Dropdown chọn Tỉnh */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="province">Tỉnh/Thành phố</label>
                  <select
                    id="province"
                    className="w-full border p-2"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown chọn Quận/Huyện */}

                <div className="mt-4 w-1/2">
                  <label htmlFor="district">Quận/Huyện</label>
                  <select
                    id="district"
                    className="w-full border p-2"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropdown chọn Xã/Phường */}
              <div className="flex flex-row w-full space-x-2">
                <div className="mt-4 w-1/2">
                  <label htmlFor="ward">Xã/Phường</label>
                  <select
                    id="ward"
                    className="w-full border p-2"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn xã/phường</option>
                    {wards.map((ward) => (
                      <option key={ward.id} value={ward.id}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nhập số nhà/đường */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="addressDetail">Số nhà, đường</label>
                  <input
                    type="text"
                    value={selectedHomeNumber}
                    onChange={(e) => setSelectedHomeNumber(e.target.value)}
                    id="addressDetail"
                    name="addressDetail"
                    className="w-full border p-2"
                    placeholder="Số 1, Đường 2"
                  />
                </div>
              </div>

              <div className="flex flex-row w-full space-x-2">
                <div className="mt-4 w-1/2">
                  <label htmlFor="ward">Email</label>
                  <input
                    id="ward"
                    value={selectedEmail}
                    type="email"
                    onChange={(e) => setSelectedEmail(e.target.value)}
                    className="w-full border p-2"
                    placeholder="hiep@gmail.com"
                  ></input>
                </div>

                {/* Nhập số nhà/đường */}
                <div className="mt-4 w-1/2">
                  <label htmlFor="addressDetail">Số điện thoại</label>
                  <input
                    type="text"
                    value={selectedPhone}
                    onChange={(e) => setSelectedPhone(e.target.value)}
                    id="addressDetail"
                    name="addressDetail"
                    className="w-full border p-2"
                    placeholder="Số 1, Đường 2"
                  />
                </div>
              </div>

              <div className="mt-2">
                <p>Chọn phương thức thanh toán:</p>
                <div className="flex flex-row items-center space-x-2 mt-2">
                  <input
                    type="radio"
                    id="vietqr"
                    name="paymentMethod"
                    onClick={() => setSelectedPaymentMethod("vietqr")}
                    value="vietqr"
                    defaultChecked
                  />
                  <label htmlFor="vietqr">Chuyển khoản qua VietQR</label>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-2">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    onClick={() => setSelectedPaymentMethod("cod")}
                    value="cod"
                  />
                  <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                </div>
              </div>
            </div>
          </Grid2>
          <Grid2 size={5}>
            <div className="border rounded p-4">
              <div className="font-medium text-xl ">Chi tiết đơn hàng</div>
              <div className="flex flex-row justify-between mt-4">
                <div className="font-thin">Tổng giá trị sản phẩm</div>
                <div className="">{order ? order.total_amount : 0} VNĐ</div>
              </div>
              <div className="flex flex-row justify-between mt-2 mb-4">
                <div className="font-thin">Giảm giá</div>
                <div>-0 VNĐ</div>
              </div>
              <Divider />
              <div className="flex flex-row justify-between mt-4">
                <div className="font-medium text-xl">Tổng thanh toán</div>
                <div className="font-medium">
                  {order ? order.total_amount : 0} VNĐ
                </div>
              </div>

              <div className="flex w-full justify-center mt-4">
                <button
                  className="bg-yellow-500 p-2 rounded w-full font-medium text-xl"
                  onClick={handleClickPayment}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </Grid2>
        </Grid2>
      </Container>
    </LayoutClient>
  );
};

export default Checkout;
