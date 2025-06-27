import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { verifyPayosWebhookSignature } from "../utils/PayOS";
import { payosClient } from "..";

const paymentService = new PaymentService();

export class PaymentController {
  async createPayment(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const result = await paymentService.createPaymentLink(orderId);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    const orderCode = req.params.orderCode;
    const result = await paymentService.confirmPayment(parseInt(orderCode));
    return res.json(result);
  }

  // async webhook(req: Request, res: Response) {
  //   console.log("Received webhook:", req.body);
  //   const { data, signature } = req.body;

  //   if (!data || !signature) {
  //     return res.status(400).json({ error: "Thiếu dữ liệu hoặc chữ ký" });
  //   }

  //   const isValid = await paymentService.verifyWebhook(req.body);

  //   if (!isValid) {
  //     return res.status(400).json({ error: "Xác thực không thành công" });
  //   }

  //   // Xử lý dữ liệu thanh toán
  //   // console.log("Dữ liệu thanh toán:", data);

  //   res.status(200).json({ message: "Webhook đã được xử lý" });
  // }
}
