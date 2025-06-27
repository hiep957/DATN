import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { asyncHandler } from "../utils/asyncHandler";

import express from "express";

const router = Router();
const controller = new PaymentController();

router.post("/create", asyncHandler(controller.createPayment));
router.post("/confirm/:orderCode", asyncHandler(controller.confirmPayment));
// router.post("/webhook", asyncHandler(controller.webhook));

export default router;