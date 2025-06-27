import { IsNull, Not } from "typeorm";

import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

export class CategoryRepository {
  private repo = AppDataSource.getRepository(Category);

  //thêm mới category
  async create(
    name: string,
    parent?: Category,
    slug?: string
  ): Promise<Category> {
    const category = this.repo.create({ name, parent, slug });
    return await this.repo.save(category);
  }

  // Lấy tất cả category (dạng phẳng)
  async findAll(): Promise<Category[]> {
    return await this.repo.find({
      relations: ["parent"],
      order: { id: "ASC" },
    });
  }

  // Lấy category theo ID
  async findById(id: number): Promise<Category | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ["parent", "children"],
    });
  }

  async findById2(slug: string): Promise<any | null> {
    return await this.repo.findOne({
      where: { slug },
    });
  }

  // Lấy tree danh mục (có con, cháu…)
  async findTree(): Promise<Category[]> {
    return await this.repo.find({
      where: { parent: IsNull() },
      relations: [
        "children",
        "children.children",
        "children.children.children",
      ],
    });
  }

  // Lấy các category cùng cha
  async findSiblings(id: number): Promise<Category[] | null> {
    const current = await this.findById(id);
    if (!current) return null;

    const parentCondition = current.parent
      ? { id: current.parent.id }
      : IsNull();

    return await this.repo.find({
      where: {
        parent: parentCondition,
        id: Not(id),
      },
    });
  }

  // Cập nhật category
  async update(
    id: number,
    name: string,
    parent?: Category,
    slug?: string
  ): Promise<Category | null> {
    const category = await this.repo.findOneBy({ id });
    if (!category) return null;

    category.name = name;
    category.parent = parent ?? null;
    category.slug = slug ?? null;

    return await this.repo.save(category);
  }

  async save(category: Category): Promise<Category> {
    return await this.repo.save(category);
  }

  // Xoá category
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  // Tìm category cha nếu có
  async findParentById(parentId: number): Promise<Category | null> {
    return await this.repo.findOneBy({ id: parentId });
  }

  async getAllChildCategoryIds(parentId: number): Promise<number[]> {
    // Lấy toàn bộ category 1 lần (hoặc tối thiểu đủ depth)
    const allCategories = await this.repo.find({
      relations: ["children"],
    });

    // Map id -> category để duyệt nhanh
    const categoryMap = new Map<number, Category>();
    for (const cat of allCategories) {
      categoryMap.set(cat.id, cat);
    }

    const result: number[] = [];

    const dfs = (id: number) => {
      result.push(id);
      const current = categoryMap.get(id);
      if (current && current.children) {
        for (const child of current.children) {
          dfs(child.id);
        }
      }
    };

    dfs(parentId);

    return result;
  }
}
