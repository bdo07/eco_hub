import { useState } from "react";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";
import {
  useListOrders,
  useUpdateOrderStatus,
  useExportOrdersCsv,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useListOrders({ page, limit: 20 });
  const updateOrderStatus = useUpdateOrderStatus();
  const { data: csvData, refetch: fetchCsv } = useExportOrdersCsv({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleExportCsv = async () => {
    const result = await fetchCsv();
    const csv = result.data?.csv;
    if (!csv) { toast({ title: "No data to export", variant: "destructive" }); return; }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `terres-dart-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exported" });
  };

  const handleStatusChange = (orderId: number, status: string) => {
    updateOrderStatus.mutate(
      { id: orderId, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "Status updated" });
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        },
      }
    );
  };

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-foreground">Orders</h1>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExportCsv}
            data-testid="button-export-csv"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        ) : (
          <>
            <div className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Order</th>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Customer</th>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Items</th>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Total</th>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.items ?? []).map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                        data-testid={`row-order-${order.id}`}
                      >
                        <td className="px-4 py-4 font-medium text-muted-foreground">#{order.id}</td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          <p className="text-xs text-muted-foreground">{order.customerCity}</p>
                        </td>
                        <td className="px-4 py-4 max-w-xs">
                          <div className="space-y-0.5">
                            {Array.isArray(order.items) && order.items.map((item, j) => (
                              <p key={j} className="text-xs text-muted-foreground">
                                {(item as { productName: string; quantity: number }).productName} x{(item as { quantity: number }).quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-primary font-semibold">${Number(order.totalPrice).toFixed(2)}</td>
                        <td className="px-4 py-4">
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order.id, v)}
                          >
                            <SelectTrigger className="h-8 w-36 text-xs" data-testid={`select-status-${order.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-4 text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {(data?.items ?? []).length === 0 && (
                  <div className="py-16 text-center text-muted-foreground">
                    <p className="font-serif text-xl">No orders yet</p>
                  </div>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} data-testid="button-prev-page">
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} data-testid="button-next-page">
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}