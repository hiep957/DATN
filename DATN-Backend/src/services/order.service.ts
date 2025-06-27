import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";
import { ProductVariant } from "../entities/ProductVariant";
import { UserRepository } from "../repositories/auth.repo";
import { OrderRepo } from "../repositories/order.repo";
import { OrderItemRepo } from "../repositories/order_item.repo";
import { ProductVariantRepository } from "../repositories/product_variant.repo";
import { BadRequestError } from "../utils/ApiError";
import { CartService } from "./cart.service";
import { ProductService } from "./product.service";

export class OrderService {
  private orderRepo = new OrderRepo();
  private orderItemRepo = new OrderItemRepo();
  private userRepo = new UserRepository();
  private productVariantRepo = new ProductVariantRepository();
  private productService = new ProductService();
  private cartService = new CartService();
  //thêm mới order
  async createOrder(order: any): Promise<any> {
    const user = await this.userRepo.findById(order.userId);
    if (!user) {
      throw new Error("User not found");
    }
    console.log("user", user);
    console.log("order", order);
    const newOrder = await this.orderRepo.create({
      user,
      shipping_address: user.address || undefined,
      payment_method: order.payment_method || "banking", // mặc định là cash
      status: "pending",
      total_amount: 0, // sẽ tính sau
    });
    console.log("newOrder", newOrder);

    if (!order.items || order.items.length === 0) {
      throw new BadRequestError("Order must have at least one item");
    }

    let count = 0;

    newOrder.items = await Promise.all(
      order.items.map(async (item: any) => {
        if (!item.productVariantId) {
          throw new BadRequestError("Product variant is required");
        }
        if (
          !this.productService.checkVariantQuantity(
            item.productVariantId,
            item.quantity
          )
        ) {
          throw new BadRequestError("Not enough stock");
        }
        const productVariant = await this.productVariantRepo.findById(
          item.productVariantId
        );
        if (!productVariant) {
          throw new BadRequestError("Product variant not found");
        }
        count++;
        console.log("Số phẩm bạn mua là", count);
        console.log("Sản phẩm bạn mua là", productVariant);
        return await this.orderItemRepo.create({
          image: item.image,
          productVariant: productVariant,
          price: item.price,
          quantity: item.quantity,
          product_name: item.product_name,
        });
      })
    );

    // Tính tổng tiền
    newOrder.total_amount = newOrder.items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    //Xóa cart items đã được đặt hàng
    //Tôi muốn sửa thành promise.all
    await Promise.all(
      order.cartItemId.map((item: string) => this.cartService.removeItem(item))
    );

    await this.orderRepo.save(newOrder);
    return newOrder;
  }

  async updateOrderInfo(orderId: number, orderData: any): Promise<any> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Cập nhật thông tin đơn hàng
    if (orderData.shipping_address) {
      order.shipping_address = orderData.shipping_address;
    }
    if (orderData.payment_method) {
      order.payment_method = orderData.payment_method;
      if (orderData.payment_method === "cod") {
        order.status = "pending"; // nếu là COD thì trạng thái là pending
      }
    }

    return this.orderRepo.save(order);
  }

  //lấy danh sách đơn hàng
  async getOrders(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const orderData = await this.orderRepo.findByUserId(userId);
    // console.log("orderData", orderData);
    if (!orderData || orderData.length === 0) {
      throw new Error("No orders found for this user");
    }
    return orderData;
  }

  async getOrderById(id: number) {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = status;
    const updatedOrder = await this.orderRepo.save(order);
    console.log("updatedOrder", updatedOrder);
    return updatedOrder;
  }

  async getAllOrders(query: any) {
    const repo = AppDataSource.getRepository(Order);
    const { page , limit, status, payment_method, sortBy } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const queryBuilder = repo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.items", "items")
      .leftJoinAndSelect("items.productVariant", "productVariant");

    if (status) {
      queryBuilder.andWhere("order.status = :status", { status });
    }
    if (payment_method) {
      queryBuilder.andWhere("order.payment_method = :payment_method", {
        payment_method,
      });
    }
    if (sortBy) {
      queryBuilder.orderBy(`order.${sortBy}`, "ASC");
    }
    queryBuilder.skip(skip).take(take);
    const [orders, total] = await queryBuilder.getManyAndCount();
    return { data: orders, total: total, page: +page, limit: +limit };
  }
}
