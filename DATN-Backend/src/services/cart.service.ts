
import { ProductVariant } from "../entities/ProductVariant";
import { UserRepository } from "../repositories/auth.repo";
import { CartItemRepository } from "../repositories/cart-item.repo";
import { CartRepository } from "../repositories/cart.repo";
import { BadRequestError } from "../utils/ApiError";

export class CartService {
  private cartRepo = new CartRepository();
  private userRepo = new UserRepository();
  private cartItemRepo = new CartItemRepository(); // Assuming you have a CartItemRepository
  async createCart(userId: number) {
    console.log("Cart serice createCart");
    const user = await this.userRepo.findById(userId);
    console.log(user);
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const existingCart = await this.cartRepo.findCartByUserId(userId);
    if (existingCart) {
      throw new BadRequestError("User already has an active cart");
    }
    const cart = await this.cartRepo.createCartForUser(user);
    return cart;
  }


  async getCart(userId: number) {
    const cart = await this.cartRepo.findCartByUser(userId);
    if (!cart) {
      throw new BadRequestError("No cart found for this user");
    }
    return cart;
  }

  async addToCart(
    cartId: string,
    productVariant: ProductVariant,
    quantity: number
  ) {
    const cart = await this.cartRepo.findCartById(cartId);
    if (!cart) {
      throw new BadRequestError("Cart not found");
    }
    const existingItem = await this.cartItemRepo.findItemInCart(
      cartId,
      productVariant.id
    );
    if (existingItem) {
      // Update quantity and total price
      return await this.cartItemRepo.updateQuantity(
        existingItem.id,
        existingItem.quantity + quantity
      );
    } else {
      // Add new item to cart
      return await this.cartItemRepo.addItemToCart(
        cart,
        productVariant,
        quantity
      );
    }
  }

  async removeItem(cartItemId: string) {
    return await this.cartItemRepo.removeItemFromCart(cartItemId);
  }

  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    const cartUpdated = await this.cartItemRepo.updateQuantity(
      cartItemId,
      quantity
    );
    return cartUpdated;
  }

  async decreaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = await this.cartItemRepo.findItemById(cartItemId);
    if (!cartItem) {
      throw new BadRequestError("Cart item not found");
    }
    const newQuantity = cartItem.quantity - quantity;
    if (newQuantity <= 0) {
      const cartDeleted = await this.cartItemRepo.removeItemFromCart(cartItemId);
      return cartDeleted;
    } else {
      const cartDeleted = await this.cartItemRepo.updateQuantity(cartItemId, newQuantity);
      return cartDeleted;
    }
  }

  async clearCart(cartId: string) {
    const cartItems = await this.cartItemRepo.findByCart(cartId);
    for (const item of cartItems) {
      await this.cartItemRepo.removeItemFromCart(item.id);
    }
  }
}
