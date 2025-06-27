import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await this.repo.save(user);
  }

  async saveUser(user: User) {
    return await this.repo.save(user);
  }

  async findUser(
    filters: { id?: number; name?: string },
    pagination: { page: number; limit: number }
  ) {
    const { id, name } = filters;
    const { page, limit } = pagination;
    const query = this.repo.createQueryBuilder("user");

    if (id) {
      query.andWhere("user.id = :id", { id });
    }
    if (name) {
      query.andWhere("user.firstName LIKE :name", { name: `%${name}%` });
    }
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }
}
