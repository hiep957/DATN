
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { ProductVariant } from "../entities/ProductVariant";

export class CartItemRepository {
  private repo = AppDataSource.getRepository(CartItem);

  async addItemToCart(
    cart: Cart,
    productVariant: ProductVariant,
    quantity: number
  ): Promise<CartItem> {
    const cartItem = this.repo.create({
      cart,
      productVariant,
      quantity,
    });
    return await this.repo.save(cartItem);
  }

  //kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  async findItemInCart(
    cartId: string,
    productVariantId: number
  ): Promise<CartItem | null> {
    return await this.repo.findOne({
      where: {
        cart: { id: cartId },
        productVariant: { id: productVariantId },
      },
      relations: ["productVariant"],
    });
  }

  async findItemById(cartItemId: string): Promise<CartItem | null> {
    return await this.repo.findOne({
      where: { id: cartItemId },
      relations: ["productVariant"],
    });
  }

  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    const cartItem = await this.repo.findOneBy({ id: cartItemId });
    if (!cartItem) {
      throw new Error("Cart item not found");
    }
    cartItem.quantity = quantity;
    await this.repo.save(cartItem);
  }

  async removeItemFromCart(cartItemId: string): Promise<void> {
    await this.repo.delete({ id: cartItemId });
  }

  async findByCart(cartId: string): Promise<CartItem[]> {
    return this.repo.find({
      where: { cart: { id: cartId } },
      relations: ["productVariant"],
    });
  }
}
