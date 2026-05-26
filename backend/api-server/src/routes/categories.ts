import { Router, type IRouter } from "express";
import { Category } from "@workspace/db";
import { CreateCategoryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json(categories);
});

router.post("/categories", async (req, res): Promise<void> => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const category = new Category(parsed.data);
  await category.save();
  res.status(201).json(category);
});

export default router;
