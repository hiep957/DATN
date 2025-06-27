
import { AppDataSource } from "../data-source";
import { OrderItem } from "../entities/OrderItem";



export class OrderItemRepo {
    private repo = AppDataSource.getRepository(OrderItem);
    //thêm mới order
    async create(orderItem: Partial<OrderItem>): Promise<OrderItem> {
        const newOrderItem = this.repo.create(orderItem);
        return await this.repo.save(newOrderItem);
    }

    
}