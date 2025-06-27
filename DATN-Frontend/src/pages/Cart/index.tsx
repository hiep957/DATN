import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  addToCart,
  decreaseQuantityCart,
  fetchCart,
  removeItemFromCart,
} from "../../redux/slice/cartSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import LayoutClient from "../../components/layout/Client/LayoutClient";
import { createOrderAPI, getCart, getInfoProductAPI } from "../../redux/api";
import { toast } from "react-toastify";

/**http://localhost:5173/cart/445cb3cc-966f-45f5-b23e-3d2145ab1051 */
const Cart = () => {
  const { cartId } = useParams();
  console.log(cartId);

  const cartRedux = useAppSelector((state) => state.cart);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [cartItemSelectedId, setCartItemSelectedId] = useState<string[]>([]);

  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  console.log("cartRedux", cartRedux);
  if (!cartId) {
    return <div>Không có cartId</div>;
  }
  const handleAddToCart = (productVariantId: number, quantity: number) => {
    dispatch(addToCart({ cartId: cartId, productVariantId, quantity }));
  };

  const handleDecreaseQuantity = (cartItemId: string, quantity: number) => {
    dispatch(decreaseQuantityCart({ cartItemId, quantity }));
  };

  const handleRemoveItem = (cartItemId: string) => {
    dispatch(removeItemFromCart({ cartItemId }));
  };
  const [productDetails, setProductDetails] = useState<Record<number, any>>({});

  const handleSelectItem = (cartItemId: string, checked: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [cartItemId]: checked,
    }));
    if (checked) {
      setPrice(
        (prev) =>
          prev +
          Number(
            cartRedux.items.find((item) => item.id === cartItemId)
              ?.productVariant?.price ?? 0
          ) *
            Number(
              cartRedux.items.find((item) => item.id === cartItemId)
                ?.quantity ?? 0
            )
      );
    } else {
      setPrice(
        (prev) =>
          prev -
          Number(
            cartRedux.items.find((item) => item.id === cartItemId)
              ?.productVariant?.price ?? 0
          ) *
            Number(
              cartRedux.items.find((item) => item.id === cartItemId)
                ?.quantity ?? 0
            )
      );
    }
  };

  useEffect(() => {
    if (cartRedux.items.length > 0) {
      // Tạo mảng các promise gọi API lấy chi tiết từng variant
      const promises = cartRedux.items.map((item) => {
        const variantId = item.productVariant?.id;
        if (!variantId) return Promise.resolve(null);
        return getInfoProductAPI(variantId)
          .then((data) => ({ variantId, data }))
          .catch(() => null);
      });

      // Khi tất cả hoàn thành, cập nhật state productDetails
      Promise.all(promises).then((results) => {
        const newDetails: Record<number, any> = {};
        results.forEach((res) => {
          if (res && res.variantId) {
            newDetails[res.variantId] = res.data;
          }
        });
        setProductDetails(newDetails);
      });
    }
  }, [cartId]);

  //Dữ liệu tạo order cần có
  // userId, shippingAddress, paymentMethod,
  const handleClickOrder = async () => {
    if (!cartRedux.user?.id) {
      toast.error("Không tìm thấy thông tin người dùng.");
      return;
    }
    const orderData = {
      userId: cartRedux.user.id, // Đảm bảo userId luôn là number
      shipping_address: cartRedux.user?.address || "", // Địa chỉ giao hàng
      total_amount: price - discount, // Tổng tiền sau khi trừ giảm giá
      items: Object.keys(selectedItems)
        .filter((key) => selectedItems[key])
        .map((cartItemId) => {
          const item = cartRedux.items.find((item) => item.id === cartItemId);
          if (!item) return null;
          const product = productDetails[item.productVariant?.id || 0];
          return {
            productVariantId: item.productVariant?.id || 0,
            product_name: product?.product.name || "",
            price: item.productVariant?.price || 0,
            quantity: item.quantity,
            image: item.productVariant?.imageUrls[0] || "", // Hình ảnh sản phẩm
          };
        })
        .filter((item) => item !== null),
      cartItemId: Object.entries(selectedItems)
        .filter(([_, value]) => value)
        .map(([cartItemId]) => cartItemId),
    };

    console.log("orderData", orderData);
    setLoading(true);
    const res = await createOrderAPI(orderData);
    if (res) {
      setLoading(false);
      dispatch(fetchCart());
      // toast.success("Đặt hàng thành công");
      console.log("Order created successfully", res);
    } else {
      setLoading(false);
      toast.error("Đặt hàng thất bại");
    }

    const orderId = res.order.id;
    if (!orderId) {
      toast.error("Không tìm thấy ID đơn hàng.");
      return;
    }
    // Chuyển hướng đến trang nhập thông tin giao hàng
    navigate(`/checkout/${orderId}`); // Chuyển hướng đến trang checkout với orderId
    // Hoặc sử dụng useNavigate nếu bạn đang sử dụng React Router
  };

  console.log("productDetails", productDetails);
  console.log("selectedItems", selectedItems);
  return (
    <LayoutClient>
      <div className="md:px-32 md:py-4">
        <div className="flex justify-center items-center bg-slate-100 p-4 rounded shadow flex-col">
          <p>Giỏ hàng của bạn</p>
          <span>
            Hiện tại bạn đang có {cartRedux.items.length} sản phẩm trong giỏ
            hàng
          </span>
        </div>
        <div className="grid grid-cols-12 mt-2 space-x-4">
          <div className="col-span-8 bg-slate-200  rounded shadow  p-4">
            <div>Giỏ hàng của bạn gồm các sản phẩm sau</div>
            <table className="w-full text-sm text-left  border-t-gray-100 bg-white mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-center">Chọn</th>
                  <th className=" px-3 py-2">Hình ảnh</th>
                  <th className=" px-3 py-2">Thông tin</th>
                  <th className=" px-3 py-2 text-left">Số lượng</th>
                  <th className=" px-3 py-2 text-left">Giá tiền</th>
                  <th className=" px-3 py-2 text-center">X</th>
                </tr>
              </thead>
              <tbody>
                {cartRedux.items.map((item) => {
                  const product = productDetails[item.productVariant?.id || 0];
                  console.log("product", product);

                  return (
                    <tr key={item.id} className="border-b hover:bg-slate-100">
                
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={!!selectedItems[item.id || ""]}
                          onChange={(e) =>
                            handleSelectItem(item.id || "", e.target.checked)
                          }
                        />
                      </td>
                      <td className=" px-3 py-2">
                        <img
                          src={item.productVariant?.imageUrls?.[0] || ""}
                          loading="lazy"
                          alt="product"
                          className="w-16 h-20 object-contain"
                        />
                      </td>
                      <td className=" px-3 py-2">
                        <p className="font-semibold">{product?.product.name}</p>
                        <p className="text-xs text-gray-500">
                          Màu: {item.productVariant?.colorName} | Size:{" "}
                          {item.productVariant?.size}
                        </p>
                      </td>
                      <td className=" px-3 py-2 text-left">
                        <div className="inline-flex items-center space-x-4 border  rounded-lg">
                          <button
                            className="hover:bg-blue-300 transition p-2"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              handleDecreaseQuantity(item.id || "", 1)
                            }
                          >
                            -
                          </button>
                          <div>{item.quantity}</div>
                          <button
                            className="hover:bg-blue-300 transition p-2"
                            onClick={() =>
                              handleAddToCart(item.productVariant?.id || 0, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className=" px-3 py-2 text-left">
                        {(item.productVariant?.price || 0).toLocaleString()}
                      </td>
                      <td className=" px-3 py-2 text-center">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveItem(item.id || "")}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-span-4 bg-slate-100 h-[300px] rounded-lg p-4">
            <div>Tóm tắt đơn hàng</div>
            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between py-8">
                <p className="font-medium">Tổng tiền hàng </p>
                <p>
                  {Object.keys(selectedItems).length > 0
                    ? price.toLocaleString()
                    : 0}{" "}
                  Đ
                </p>
              </div>
              <Divider />
              <div className="flex justify-between py-8">
                <p className="font-medium">Giảm giá </p>
                <p>
                  {Object.keys(selectedItems).length > 0
                    ? discount.toLocaleString()
                    : 0}{" "}
                  Đ
                </p>
              </div>
              <Divider />
              <div className="flex justify-between py-8">
                <p className="font-medium">Tạm tính </p>
                <p>
                  {Object.keys(selectedItems).length > 0
                    ? (price - discount).toLocaleString()
                    : 0}{" "}
                  Đ
                </p>
              </div>
              <Divider />
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                onClick={handleClickOrder}
              >
                {loading ? <CircularProgress size={24} /> : "Đặt hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <button className="p-2 bg-slate-200 rounded" onClick={handleAddToCart}>
        Thêm giỏ hàng
      </button>
      <button
        className="p-2 bg-slate-200 rounded"
        onClick={handleDecreaseQuantity}
      >
        Giảm số lượng
      </button> */}
      {/* <div>
        {cartRedux.items.map((item) => (
          <div key={item.id}>
            <p>Product Variant: {item.productVariant?.id}</p>
            <p>Số lượng: {item.quantity}</p>
            <p>CartItemId: {item.id}</p>
            <Divider />
          </div>
        ))}
      </div> */}
    </LayoutClient>
  );
};

export default Cart;
