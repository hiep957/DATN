import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logoutAPI } from "../../../redux/api";
import { logout } from "../../../redux/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../ui/SearchBar";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";
import MenuCategory from "../../ui/MenuCategory";
import { clearCart, fetchCart } from "../../../redux/slice/cartSlice";

import { CiShoppingCart } from "react-icons/ci";
import React from "react";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const dataUser = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  console.log("cart trong header", cart);
  console.log("dataUser trong header User", dataUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const res = await logoutAPI();
      if (res.success) {
        console.log("Đăng xuất thành công");
        dispatch(logout());
        dispatch(clearCart());
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const handleLogin = () => {
    navigate("/login");
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header>
      <div className="flex flex-col md:flex-row md:justify-between text-white bg-blue-400 relative md:px-32 py-4   shadow-slate-200">
        <button
          className="absolute top-0 left-0 md:hidden p-4"
          onClick={() => setOpenMenu(true)}
        >
          <IoMenu className="text-3xl md:hidden" />
        </button>
        {openMenu && (
          <MenuCategory setOpenMenu={setOpenMenu} openMenu={openMenu} />
        )}
        <div className="text-xl flex justify-center items-center">
          <button onClick={() => navigate("/")}>
            <p className="font-bold text-2xl">Smart Fashion</p>
          </button>
        </div>
        <div>
          <SearchBar />
        </div>
        {dataUser.isAuthenticated ? (
          <div className="flex gap-2 justify-center">
            <Link to={`/cart/${cart.id}`}>
              <div className="relative flex items-center">
                <CiShoppingCart className="w-8 h-8" />
                <span className="absolute top-0 left-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cart ? cart.items.length : 0}
                </span>
              </div>
            </Link>
            <p className="flex items-center">
              Xin chào{", "}
              {dataUser.user?.firstName + " " + dataUser.user?.lastName}
            </p>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => navigate("/profile")}>
                <Avatar /> Hồ sơ cá nhân
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <button className="text-md p-2 text-black bg-white rounded hover:bg-blue-400 transition" onClick={handleLogin}>
              Đăng nhập
            </button>
            <button className="text-md p-2 text-black bg-white rounded hover:bg-blue-400 transition">Đăng ký</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
