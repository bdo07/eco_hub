import { useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useListCategories,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  images: string;
  stock: string;
  colors: string;
  handmadeDetails: string;
  isFeatured: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: "", description: "", price: "", categoryId: "",
  images: "", stock: "10", colors: "", handmadeDetails: "", isFeatured: false,
};

export default function AdminProducts() {
  const { data, isLoading } = useListProducts({ limit: 100 });
  const { data: categories } = useListCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  const openCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setDialogOpen(true); };
  const openEdit = (product: NonNullable<typeof data>["items"][number]) => {
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: String(product.categoryId),
      images: product.images.join(", "),
      stock: String(product.stock),
      colors: product.colors.join(", "),
      handmadeDetails: product.handmadeDetails ?? "",
      isFeatured: product.isFeatured,
    });
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      categoryId: form.categoryId,
      images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      stock: parseInt(form.stock, 10),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      handmadeDetails: form.handmadeDetails || undefined,
      isFeatured: form.isFeatured,
    };

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    };

    if (editingId) {
      updateProduct.mutate(
        { id: editingId, data: payload },
        { onSuccess: () => { toast({ title: "Product updated" }); setDialogOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
      );
    } else {
      createProduct.mutate(
        { data: payload },
        { onSuccess: () => { toast({ title: "Product created" }); setDialogOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
      );
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Product deleted" });
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-foreground">Products</h1>
          <Button onClick={openCreate} className="bg-primary text-primary-foreground gap-2" data-testid="button-add-product">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
          </div>
        ) : (
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Product</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Price</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Stock</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Featured</th>
                    <th className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.items ?? []).map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                      data-testid={`row-product-${product.id}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            {product.images[0] ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-muted" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.categoryName ?? "-"}</td>
                      <td className="px-4 py-3 text-primary font-semibold">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                          {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {product.isFeatured && <Star className="h-4 w-4 text-primary fill-primary" />}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(product)}
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(product.id, product.name)}
                            data-testid={`button-delete-product-${product.id}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product form dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingId ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="p-name">Name *</Label>
                <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="input-product-name" />
              </div>
              <div>
                <Label htmlFor="p-desc">Description *</Label>
                <Textarea id="p-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required data-testid="input-product-description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="p-price">Price ($) *</Label>
                  <Input id="p-price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required data-testid="input-product-price" />
                </div>
                <div>
                  <Label htmlFor="p-stock">Stock *</Label>
                  <Input id="p-stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required data-testid="input-product-stock" />
                </div>
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-images">Image URLs (comma-separated)</Label>
                <Input id="p-images" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." data-testid="input-product-images" />
              </div>
              <div>
                <Label htmlFor="p-colors">Colors (comma-separated)</Label>
                <Input id="p-colors" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Terracotta, Sand, Ivory" data-testid="input-product-colors" />
              </div>
              <div>
                <Label htmlFor="p-handmade">Handmade Details</Label>
                <Textarea id="p-handmade" value={form.handmadeDetails} onChange={(e) => setForm({ ...form, handmadeDetails: e.target.value })} rows={2} data-testid="input-product-handmade" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="p-featured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded"
                  data-testid="checkbox-product-featured"
                />
                <Label htmlFor="p-featured">Featured product</Label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  data-testid="button-save-product"
                >
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
