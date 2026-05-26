import { Router, type IRouter } from "express";
import { Order, Product } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [orderStats, productCount, recentOrders] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]),
    Product.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const stats = orderStats[0] || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };

  res.json({
    totalOrders: stats.totalOrders,
    totalRevenue: stats.totalRevenue,
    totalProducts: productCount,
    pendingOrders: stats.pendingOrders,
    recentOrders,
  });
});

router.get("/stats/top-products", async (_req, res): Promise<void> => {
  // Extract all items from all orders and count
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        productName: { $first: "$items.productName" },
        totalOrdered: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalOrdered: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: 1,
        totalOrdered: 1,
      },
    },
  ]);

  res.json(result);
});

router.get("/stats/orders-by-status", async (_req, res): Promise<void> => {
  const rows = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);

  res.json(rows);
});

export default router;
