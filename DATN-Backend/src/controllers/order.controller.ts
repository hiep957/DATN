import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { IAuthRequest } from "../interfaces/Auth";
import { BadRequestError } from "../utils/ApiError";
const orderService = new OrderService();
export class OrderController {
  static async createOrder(req: Request, res: Response) {
    console.log("createOrder Controller", req.body);
    const order = await orderService.createOrder(req.body);

    res.status(201).json({ message: "Order created successfully", order });
  }

  static async getOrdersByUserId(req: IAuthRequest, res: Response) {
    if(!req.user) {
      throw new BadRequestError("User not found");
    }
    console.log("getOrdersByUserId Controller", req.user.id);
    const orders = await orderService.getOrders(req.user.id);
    res.status(200).json(orders);
  }

  static async getOrderById(req: Request, res: Response) {
    const id = parseInt(req.params.orderId);
    console.log("getOrderById Controller", id);
    const order = await orderService.getOrderById(id);
    if (!order) {
      throw new BadRequestError("Order not found");
    }
    res.status(200).json({ message: "Order retrieved successfully", data: order });
  }

  static async updateOrderStatus(req: IAuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    console.log("updateOrderStatus Controller", id, req.body);
    const order = await orderService.updateOrderStatus(id, status);
    if (!order) {
      throw new BadRequestError("Order not found");
    }
    res.status(200).json({ message: "Order status updated successfully", data: order });
  }

  static async updateOrder(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const orderData = req.body;
    console.log("updateOrder Controller", id, orderData);
    const updatedOrder = await orderService.updateOrderInfo(id, orderData);
    if (!updatedOrder) {
      throw new BadRequestError("Order not found");
    }
    res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
  }


  static async listOrders(req: Request, res: Response) {
    const orders = await orderService.getAllOrders(req.query);
    res.status(200).json({ message: "Orders retrieved successfully", data: orders });
  }
}
