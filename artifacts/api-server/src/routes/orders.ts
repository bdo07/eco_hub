import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";
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

  const conditions = [];
  if (status) conditions.push(eq(ordersTable.status, status));
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [countResult, rows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(ordersTable).where(where),
    db.select().from(ordersTable).where(where).orderBy(ordersTable.createdAt).limit(limit).offset((page - 1) * limit),
  ]);

  res.json({
    items: rows.map((r) => ({ ...r, totalPrice: Number(r.totalPrice) })),
    total: countResult[0]?.count ?? 0,
    page,
    limit,
  });
});

router.get("/orders/export/csv", async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);

  const header = "ID,Customer Name,Phone,City,Address,Products,Total Price,Status,Date";
  const rows = orders.map((o) => {
    const items = Array.isArray(o.items)
      ? o.items.map((i: { productName: string; quantity: number; unitPrice: number }) => `${i.productName} x${i.quantity} @${i.unitPrice}`).join(" | ")
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
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ ...order, totalPrice: Number(order.totalPrice) });
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Resolve product names and prices
  const itemsWithDetails = await Promise.all(
    parsed.data.items.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId)).limit(1);
      return {
        productId: item.productId,
        productName: product?.name ?? "Unknown",
        quantity: item.quantity,
        unitPrice: Number(product?.price ?? 0),
      };
    })
  );

  const totalPrice = itemsWithDetails.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      customerCity: parsed.data.customerCity,
      customerAddress: parsed.data.customerAddress,
      notes: parsed.data.notes,
      items: itemsWithDetails,
      totalPrice: String(totalPrice),
      status: "pending",
    })
    .returning();

  res.status(201).json({ ...order, totalPrice: Number(order.totalPrice) });
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
  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ ...order, totalPrice: Number(order.totalPrice) });
});

export default router;
