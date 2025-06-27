import { Request, Response } from "express";

import { LikeService } from "../services/like.service";
import { BadRequestError } from "../utils/ApiError";

import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";

const likeService = new LikeService();

export class LikeController {
  async createLike(req: Request, res: Response) {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      throw new BadRequestError("User ID and Product ID are required");
    }

    const existingLike = await AppDataSource.getRepository(Like).findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existingLike) {
      const deletedLike = await likeService.delete(userId, productId);
      return res.status(200).json({
        message: "Like removed successfully",
        data: deletedLike,
      });
    }
    const createLike = await likeService.create(userId, productId);
    res.status(201).json({
      message: "Like created successfully",
      data: createLike,
    });
  }

  async getLikeByProduct(req: Request, res: Response) {
    const productId = req.params.productId;
    if (!productId) {
      throw new BadRequestError("Product ID is required");
    }
    const data = await likeService.getLikesByProductId(parseInt(productId));
    if (!data) {
      throw new BadRequestError("No likes found for this product");
    }
    res.status(200).json({
      message: "Likes retrieved successfully",
      data: data.map((like) => like.user),
    });
  }

  async getLikeByUser(req: Request, res: Response) {
    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    const data = await likeService.getLikesByUserId(parseInt(userId));
    if (!data) {
      throw new BadRequestError("No likes found for this user");
    }
    res.status(200).json({
      message: "Likes retrieved successfully",
      data: data.map((like) => like.product),
    });
  }
}
