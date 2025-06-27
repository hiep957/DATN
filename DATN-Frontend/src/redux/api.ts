import { toast } from "react-toastify";
import { LoginType, logout, RegisterType, setUser } from "./slice/authSlice";
import { customFetch } from "../features/customFetch";
import { useAppDispatch } from "./hook";
import { OrderInput } from "../types/Order";



export const signUp = async (registerData: RegisterType) => {
  const response = await fetch(`http://localhost:3000/api/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Registration failed");
  }
};

export const signIn = async (loginData: LoginType) => {
  const response = await fetch(`http://localhost:3000/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Login failed");
  }
};

export const setUserAPI = async () => {
  const response = await customFetch(`http://localhost:3000/api/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to set user data");
  }
};

export const updateProfileAPI = async (data: any) => {
  const response = await customFetch(`http://localhost:3000/api/auth/me`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const logoutAPI = async () => {
  const response = await customFetch(`http://localhost:3000/api/auth/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    toast.success("Logout successful");
    return { success: true };
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to logout");
  }
};

export const getCategoryTree = async () => {
  const response = await fetch(
    `http://localhost:3000/api/category/categories/tree`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to fetch categories");
  }
};

///Cart

export const createCart = async () => {
  const response = await customFetch(`http://localhost:3000/api/create-cart`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to create cart");
  }
};

export const getCart = async () => {
  const response = await customFetch(
    `http://localhost:3000/api/cart/get-cart`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to get cart");
  }
};

export const addToCartAPI = async (
  cartId: string,
  productVariantId: number,
  quantity: number
) => {
  const response = await customFetch(
    `http://localhost:3000/api/cart/add-to-cart`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId, productVariantId, quantity }),
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to add to cart");
  }
};

export const decreaseQuantityAPI = async (
  quantity: number,
  cartItemId: string
) => {
  const response = await customFetch(
    `http://localhost:3000/api/cart/decrease-quantity/${cartItemId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to decrease quantity");
  }
};

export const removeItemAPI = async (cartItemId: string) => {
  const response = await customFetch(
    `http://localhost:3000/api/cart/remove-cart-item/${cartItemId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to remove item");
  }
};

export const getInfoProductAPI = async (variantId: number) => {
  const response = await customFetch(
    `http://localhost:3000/api/product/variant/${variantId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    return data.data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to get product info");
  }
};



export const createOrderAPI = async (orderData: OrderInput)=> {
  const res = await customFetch(`http://localhost:3000/api/order/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to create order");
  }
}

export const updateOrderAPI = async(orderId: number, shipping_address?: string, payment_method?: string) => {
  const res = await customFetch(`http://localhost:3000/api/order/${orderId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ shipping_address, payment_method }),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to update order");
  }
}

export const createPaymentLink = async(orderId: number) => {
  const res = await customFetch(`http://localhost:3000/api/payment/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    toast.error(data.message);
    throw new Error(data.message || "Failed to create payment link");
  }
}
