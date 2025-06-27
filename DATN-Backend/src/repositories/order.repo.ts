
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";

export class OrderRepo {
  private repo = AppDataSource.getRepository(Order);
  //thêm mới order
  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.repo.create(order);
    return await this.repo.save(newOrder);
  }
  async save(order: Partial<Order>): Promise<Order> {
    return await this.repo.save(order);
  }
  async findByUserId(userId: number): Promise<Order[]> {
    return await this.repo.find({
      where: { user: { id: userId } },
      relations: ["items","items.productVariant","items.productVariant.product"],
    });
  }

  async findById(id: number): Promise<Order | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["items"],
    });
  }
}
