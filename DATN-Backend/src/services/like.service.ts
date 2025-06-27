
import { AppDataSource } from "../data-source";
import { Like } from "../entities/Like";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

export class LikeService {
  private likeRepo = AppDataSource.getRepository(Like);
  private userRepo = AppDataSource.getRepository(User);
  private productRepo = AppDataSource.getRepository(Product);
  async create(userId: number, productId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const like = this.likeRepo.create({ user, product });
    await this.likeRepo.save(like);
    return like;
  }

  async delete(userId: number, productId: number) {
    const like = await this.likeRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!like) {
      throw new Error("Like not found");
    }
    const deletedLike = await this.likeRepo.remove(like);
    return deletedLike;
  }

  async getLikesByProductId(productId: number) {
    const likes = await this.likeRepo.find({
      where: { productId },
      relations: ["user"],
    });
    return likes;
  }

  async getLikesByUserId(userId: number) {
    const likes = await this.likeRepo.find({
      where: { userId },
      relations: ["product"],
    });
    return likes;
  }
}
