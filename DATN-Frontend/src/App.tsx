import { useState } from "react";

import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import LoginDashboard from "./pages/Login/DashboardLogin";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./routes/ProtectedRoute";
import GoogleCallback from "./pages/Login/GoogleCallback";
import AddProduct from "./pages/ProductAdmin/AddProduct";
import ListProduct from "./pages/ProductAdmin/ListProduct";
import EditProduct from "./pages/ProductAdmin/EditProduct";
import Category from "./pages/Category";
import ClientLogin from "./pages/Login/ClientLogin";
import ProductList from "./pages/Product";
import ProductDetail from "./pages/Product/ProductDetail";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import MyOrder from "./pages/MyOrder";
import Checkout from "./pages/Checkout";
import { Check } from "lucide-react";
import Success from "./pages/Success";
import UserPage from "./pages/UserAdmin/UserPage";
import OrderManage from "./pages/OrderManage";
import Register from "./pages/Register";
import SearchPage from "./pages/Search/SearchPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/search" element={<SearchPage />} />
        <Route path="/login-admin" element={<LoginDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<GoogleCallback />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-manage"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrderManage />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/product-admin" element={<ListProduct />} />
        <Route path="/product-admin/edit/:id" element={<EditProduct />} />
        <Route path="/category" element={<Category />} />
        <Route
          path="/cart/:cartId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyOrder />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />s
      <Route path="*" element={<NotFound />} /> */}

        {/**Những trang dành cho Client */}
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/checkout/:orderId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Checkout />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
