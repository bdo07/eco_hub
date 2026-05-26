import { Router, type IRouter } from "express";
import { Order, Product } from "@workspace/db";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/orders", async (req, res): Promise<void> => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, page = 1, limit = 20 } = parsed.data;

  const query: any = {};
  if (status) query.status = status;

  const [total, items] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query)
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

router.get("/orders/export/csv", async (_req, res): Promise<void> => {
  const orders = await Order.find().sort({ createdAt: 1 }).lean();

  const header = "ID,Customer Name,Phone,City,Address,Products,Total Price,Status,Date";
  const rows = orders.map((o: any) => {
    const items = Array.isArray(o.items)
      ? o.items.map((i: any) => `${i.productName} x${i.quantity} @${i.unitPrice}`).join(" | ")
      : "";
    return [
      o.id,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerCity}"`,
      `"${o.customerAddress}"`,
      `"${items}"`,
      Number(o.totalPrice).toFixed(2),
      o.status,
      new Date(o.createdAt).toISOString(),
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  res.json({ csv });
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  
  const order = await Order.findById(params.data.id).lean();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Resolve product names and prices
  const itemsWithDetails = await Promise.all(
    parsed.data.items.map(async (item: any) => {
      const product = await Product.findById(item.productId).lean();
      return {
        productId: item.productId,
        productName: product?.name ?? "Unknown",
        quantity: item.quantity,
        unitPrice: Number(product?.price ?? 0),
      };
    })
  );

  const totalPrice = itemsWithDetails.reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0);

  const order = new Order({
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    customerCity: parsed.data.customerCity,
    customerAddress: parsed.data.customerAddress,
    notes: parsed.data.notes,
    items: itemsWithDetails,
    totalPrice: totalPrice,
    status: "pending",
  });
  
  await order.save();

  res.status(201).json(order);
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const order = await Order.findByIdAndUpdate(params.data.id, { status: parsed.data.status }, { new: true }).lean();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

export default router;
