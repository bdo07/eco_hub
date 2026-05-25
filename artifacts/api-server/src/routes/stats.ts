import { Router, type IRouter } from "express";
import { sql, eq } from "drizzle-orm";
import { db, ordersTable, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [orderStats] = await db.select({
    totalOrders: sql<number>`count(*)::int`,
    totalRevenue: sql<number>`coalesce(sum(total_price::numeric), 0)`,
    pendingOrders: sql<number>`count(*) filter (where status = 'pending')::int`,
  }).from(ordersTable);

  const [productStats] = await db.select({
    totalProducts: sql<number>`count(*)::int`,
  }).from(productsTable);

  const recentOrders = await db
    .select()
    .from(ordersTable)
    .orderBy(ordersTable.createdAt)
    .limit(5);

  res.json({
    totalOrders: orderStats?.totalOrders ?? 0,
    totalRevenue: Number(orderStats?.totalRevenue ?? 0),
    totalProducts: productStats?.totalProducts ?? 0,
    pendingOrders: orderStats?.pendingOrders ?? 0,
    recentOrders: recentOrders.map((o) => ({ ...o, totalPrice: Number(o.totalPrice) })),
  });
});

router.get("/stats/top-products", async (_req, res): Promise<void> => {
  const orders = await db.select({ items: ordersTable.items }).from(ordersTable);

  const productCounts = new Map<number, { productName: string; totalOrdered: number }>();
  for (const order of orders) {
    const items = order.items as Array<{ productId: number; productName: string; quantity: number }>;
    if (Array.isArray(items)) {
      for (const item of items) {
        const existing = productCounts.get(item.productId);
        if (existing) {
          existing.totalOrdered += item.quantity;
        } else {
          productCounts.set(item.productId, {
            productName: item.productName,
            totalOrdered: item.quantity,
          });
        }
      }
    }
  }

  const top = Array.from(productCounts.entries())
    .map(([productId, data]) => ({ productId, ...data }))
    .sort((a, b) => b.totalOrdered - a.totalOrdered)
    .slice(0, 10);

  res.json(top);
});

router.get("/stats/orders-by-status", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  res.json(rows);
});

export default router;
