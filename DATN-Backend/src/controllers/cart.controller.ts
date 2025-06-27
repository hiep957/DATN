import { Request, Response } from "express";
import { CartService } from "../services/cart.service";
import { IAuthRequest } from "../interfaces/Auth";
import { BadRequestError } from "../utils/ApiError";

const cartService = new CartService();
export class CartController {
  static async createCart(req: IAuthRequest, res: Response) {
    const userId = req.user?.id; // Assuming you have user ID in req.user from authentication middleware
    console.log("User ID from request:", userId); // Debugging line
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const cart = await cartService.createCart(userId);
    return res
      .status(201)
      .json({ data: cart, message: "Cart created successfully" });
  }

 

  static async getCart(req: IAuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const cart = await cartService.getCart(userId);
    return res.json({ data: cart, message: "Cart retrieved successfully" });
  }

  static async addToCart(req: IAuthRequest, res: Response) {
    const { cartId, productVariantId, quantity } = req.body;
    const variant = { id: productVariantId } as any; // Assuming you have the product variant ID in the request body
    if (!cartId || !productVariantId || !quantity) {
      throw new BadRequestError(
        "Cart ID, product variant ID, and quantity are required"
      );
    }
    const result = await cartService.addToCart(cartId, variant, quantity);
    return res.json({
      data: result,
      message: "Product added to cart successfully",
    });
  }

  static async updateQuantity(req: IAuthRequest, res: Response) {
    const cartItemId = req.params.cartItemId; // Assuming you pass the cart item ID in the URL
    const { quantity } = req.body;
    if (!cartItemId || !quantity) {
      throw new BadRequestError(
        "Cart item ID, quantity, and price each are required"
      );
    }
    await cartService.updateQuantity(cartItemId, quantity);
    return res.json({
      message: "Cart item quantity updated successfully",
    });
  }

  static async decreaseQuantity(req: IAuthRequest, res: Response) {
    const cartItemId = req.params.cartItemId; // Assuming you pass the cart item ID in the URL
    const { quantity } = req.body;
    if (!cartItemId || !quantity) {
      throw new BadRequestError(
        "Cart item ID, quantity, and price each are required"
      );
    }
    const data = await cartService.decreaseQuantity(cartItemId, quantity);
    return res.json({
      message: "Cart item quantity decreased successfully",
      data:data
    });
  }

  static async removeItem(req: IAuthRequest, res: Response) {
    const cartItemId = req.params.cartItemId; // Assuming you pass the cart item ID in the URL
    if (!cartItemId) {
      throw new BadRequestError("Cart item ID is required");
    }
    const result = await cartService.removeItem(cartItemId);
    return res.json({
      data: result,
      message: "Cart item removed successfully",
    });
  }
}
