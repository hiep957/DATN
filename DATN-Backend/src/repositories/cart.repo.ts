
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { AppDataSource } from "../data-source";

export class CartRepository {



  private repo = AppDataSource.getRepository(Cart);

  async createCartForUser(user: User): Promise<Cart> {
    const cart = new Cart();
    cart.user = user;
    cart.items = []; // Initialize with an empty array
    return this.repo.save(cart);
  }

  async findCartByUserId(userId: number): Promise<Cart | null> {
    return this.repo.findOne({
      where: { user: { id: userId }},
      relations: ["items", "items.productVariant"],
    });
  }

  async findCartByUser(userId: number): Promise<Cart | null> {
    return this.repo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.productVariant", "user"],
    });
  }

  //tìm giỏ hàng theo id, bao gồm cac sản phẩm trong giỏ hàng
  async findCartById(cartId: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { id: cartId },
      relations: ["items", "items.productVariant"],
    });
  }

 

  
  

}
