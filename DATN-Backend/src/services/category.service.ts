import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category.repo";
import { BadRequestError } from "../utils/ApiError";

export class CategoryService {
  private categoryRepo = new CategoryRepository();

  async createCategory(name: string, parentId?: number, slug?:string): Promise<Category> {
    const parent = parentId
      ? await this.categoryRepo.findParentById(parentId)
      : undefined;

    return await this.categoryRepo.create(name, parent ?? undefined, slug);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepo.findAll();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepo.findById(id);
  }

  async getCategoryTree(): Promise<Category[]> {
    return await this.categoryRepo.findTree();
  }

  async getSiblings(id: number): Promise<Category[] | null> {
    return await this.categoryRepo.findSiblings(id);
  }
  async updateCategory(
    id: number,
    name: string,
    parentId?: number,
    slug?: string
  ): Promise<Category | null> {
    const category = await this.categoryRepo.findById(id);
    if (!category) throw new BadRequestError("Category not found");
    const parent = parentId
      ? await this.categoryRepo.findParentById(parentId)
      : undefined;
    console.log("parent", parent);
    category.name = name;
    category.parent = parent ?? null;
    category.slug = slug ?? null;
    const categoryUpdated = await this.categoryRepo.save(category);
    console.log("categoryUpdated", categoryUpdated);
    return categoryUpdated;
  }
  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}
