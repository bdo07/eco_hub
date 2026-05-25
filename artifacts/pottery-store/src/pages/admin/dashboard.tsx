import { useLocation, Link } from "wouter";
import { ShoppingBag, DollarSign, Package, Clock, BarChart2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  useGetAdminMe,
  useGetStatsSummary,
  useGetTopProducts,
  useGetOrdersByStatus,
} from "@workspace/api-client-react";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const [location] = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="h-8 w-32" /></div>;
  }
  if (!me?.authenticated) {
    setLocation("/admin/login");
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: BarChart2 },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-card border-r border-card-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/"><h2 className="font-serif text-xl text-foreground cursor-pointer">Terres d&apos;Art</h2></Link>
          <p className="text-xs text-muted-foreground mt-1">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <div
                data-testid={`nav-${label.toLowerCase()}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  location === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-muted-foreground justify-start"
            onClick={() => setLocation("/admin/login")}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export { AdminLayout };

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStatsSummary();
  const { data: topProducts } = useGetTopProducts();
  const { data: ordersByStatus } = useGetOrdersByStatus();

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: "text-blue-500" },
    { label: "Revenue", value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: DollarSign, color: "text-green-500" },
    { label: "Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-amber-500" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-serif text-3xl text-foreground mb-8">Dashboard</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-card border border-card-border rounded-xl p-5"
            >
              {statsLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <>
                  <card.icon className={`h-5 w-5 ${card.color} mb-3`} />
                  <p className="text-2xl font-semibold text-foreground">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by status */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="font-serif text-lg text-foreground mb-4">Orders by Status</h2>
            <div className="space-y-3">
              {(ordersByStatus ?? []).map((row) => (
                <div key={row.status} className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={
                      row.status === "pending" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      row.status === "confirmed" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      row.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      "bg-muted text-muted-foreground"
                    }
                  >
                    {row.status}
                  </Badge>
                  <span className="font-semibold text-foreground">{row.count}</span>
                </div>
              ))}
              {(!ordersByStatus || ordersByStatus.length === 0) && (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              )}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h2 className="font-serif text-lg text-foreground mb-4">Top Products</h2>
            <div className="space-y-3">
              {(topProducts ?? []).slice(0, 5).map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{p.productName}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{p.totalOrdered} sold</span>
                </div>
              ))}
              {(!topProducts || topProducts.length === 0) && (
                <p className="text-sm text-muted-foreground">No sales data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="mt-6 bg-card border border-card-border rounded-xl p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Recent Orders</h2>
          {(stats?.recentOrders ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-3 text-muted-foreground font-medium">ID</th>
                    <th className="pb-3 text-muted-foreground font-medium">Customer</th>
                    <th className="pb-3 text-muted-foreground font-medium">City</th>
                    <th className="pb-3 text-muted-foreground font-medium">Total</th>
                    <th className="pb-3 text-muted-foreground font-medium">Status</th>
                    <th className="pb-3 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.recentOrders ?? []).map((order) => (
                    <tr key={order.id} className="border-b border-border/50 last:border-0" data-testid={`row-order-${order.id}`}>
                      <td className="py-3 text-muted-foreground">#{order.id}</td>
                      <td className="py-3 font-medium">{order.customerName}</td>
                      <td className="py-3 text-muted-foreground">{order.customerCity}</td>
                      <td className="py-3 text-primary font-semibold">${Number(order.totalPrice).toFixed(2)}</td>
                      <td className="py-3">
                        <Badge variant="secondary" className="text-xs">{order.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
