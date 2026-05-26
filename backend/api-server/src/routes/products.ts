import { Router, type IRouter } from "express";
import { Product, Category } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, minPrice, maxPrice, inStock, page = 1, limit = 12 } = parsed.data;

  const query: any = {};
  
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) query.categoryId = cat.id;
  }
  
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  
  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null) query.price.$gte = minPrice;
    if (maxPrice != null) query.price.$lte = maxPrice;
  }
  
  if (inStock) {
    query.stock = { $gt: 0 };
  }

  const [total, items] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    items,
    total,
    page,
    limit,
  });
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await Product.find({ isFeatured: true }).limit(8).lean();
  res.json(products);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  
  const product = await Product.findById(params.data.id).lean();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const product = new Product(parsed.data);
  await product.save();
  res.status(201).json(product);
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const product = await Product.findByIdAndUpdate(params.data.id, parsed.data, { new: true }).lean();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  
  const deleted = await Product.findByIdAndDelete(params.data.id);
  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
