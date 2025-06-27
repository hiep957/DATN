import axios from "axios";
import { OrderRepo } from "../repositories/order.repo";
import { createPayosRequestSignature } from "../utils/PayOS";
import { payosClient } from "..";
import { stat } from "fs";
import { ProductService } from "./product.service";
import { OrderService } from "./order.service";

export class PaymentService {
  private orderRepo = new OrderRepo();
  private productService = new ProductService();
  private orderService = new OrderService();
  async createPaymentLink(orderId: number) {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found");
    console.log(order);
    const data = {
      orderCode: order.id,
      amount: Number(order.total_amount),
      description: `Thanh toan don ${order.id}`,
      returnUrl: "http://localhost:5173/success",
      cancelUrl: "http://localhost:5173/cancel",
    };
    const paymentResult = await payosClient.createPaymentLink(data);
    if (!paymentResult) throw new Error("Failed to create payment link");
    return {
      status: "success",
      data: paymentResult,
    };
  }

  async confirmPayment(orderCode: number) {
    const paymentInfo = await payosClient.getPaymentLinkInformation(orderCode);
    if (!paymentInfo) throw new Error("Payment information not found");
    const order = await this.orderRepo.findById(orderCode);

    console.log("Order:", order);
    if (!order) throw new Error("Order not found");
    if (paymentInfo.status === "PAID") {
      order.status = "paid";
      await this.orderRepo.save(order);
    }
    // Giảm số lượng sản phẩm trong kho
    for (const item of order.items) {
      const result = await this.productService.decreaseVariantQuantity(
        item.productVariant.id,
        item.quantity
      );
      if (!result) {
        throw new Error("Failed to decrease product variant quantity");
      }
      console.log(result);
    }
    //Tăng số lượng đã mua

    console.log(paymentInfo);
    return true;
  }

  //còn vấn đề xử lý đồng thời nữa, mấy hôm nữa sửa sau, nên trừ số lượng sản phẩm trước khi tạo link thanh toán
  //https://chatgpt.com/c/683279b1-7314-8011-b688-f295c4024468 ( Link tham khảo)

  // async verifyWebhook(data: any) {
  //   const webhookData = payosClient.verifyPaymentWebhookData(data);
  //   console.log("Webhook data trong service:", webhookData);
  //   if (!webhookData) {
  //     throw new Error("Invalid webhook data");
  //   }
  //   if (webhookData.desc !== "success" && webhookData.code !== "00") {
  //     throw new Error("Payment verification failed");
  //   }
  //   const order = await this.orderRepo.findById(webhookData.orderCode);
  //   if (!order) {
  //     throw new Error("Order not found");
  //   }

  //   // Giảm số lượng sản phẩm trong kho
  //   for (const item of order.items) {
  //     const result = await this.productService.decreaseVariantQuantity(
  //       item.productVariant.id,
  //       item.quantity
  //     );
  //     if (!result) {
  //       throw new Error("Failed to decrease product variant quantity");
  //     }
  //     console.log(result);
  //   }
  //   // Cập nhật trạng thái đơn hàng
  //   const orderUpdated = await this.orderService.updateOrderStatus(
  //     order.id,
  //     "paid"
  //   );
  //   console.log("Order updated:", orderUpdated);

  //   return webhookData;
  // }
}
