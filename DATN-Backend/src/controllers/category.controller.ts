import { CategoryService } from "../services/category.service";
import { Response, Request } from "express";
import { BadRequestError } from "../utils/ApiError";

const categoryService = new CategoryService();

export class CategoryController {
  static async create(req: any, res: Response) {
    const { name, parentId, slug } = req.body;

    const category = await categoryService.createCategory(name, parentId, slug);
    return res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  }

  static async getAll(req: Request, res: Response) {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const category = await categoryService.getCategoryById(id);
    if (!category) throw new BadRequestError("Category not found");
    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  }

  static async getTree(req: Request, res: Response) {
    const tree = await categoryService.getCategoryTree();
    res
      .status(200)
      .json({ data: tree, message: "Category tree retrieved successfully" });
  }

  static async getSiblings(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const siblings = await categoryService.getSiblings(id);
    if (!siblings) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data: siblings, message: "Siblings retrieved successfully" });
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { name, parentId, slug } = req.body;
    console.log("category update", id, name, parentId, slug);
    const updated = await categoryService.updateCategory(id, name, parentId, slug);
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ data: updated, message: "Category updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await categoryService.deleteCategory(id);
    res.status(204).send();
  }
}
