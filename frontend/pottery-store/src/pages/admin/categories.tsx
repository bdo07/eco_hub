import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";
import {
  useListCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image: string;
}

const EMPTY_FORM: CategoryForm = {
  name: "", slug: "", description: "", image: "",
};

export default function AdminCategories() {
  const { data, isLoading } = useListCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (category: NonNullable<typeof data>[number]) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
    });
    setEditingId(category.id);
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description || undefined,
      image: form.image || undefined,
    };

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
    };

    if (editingId) {
      updateCategory.mutate(
        { id: editingId, data: payload },
        { onSuccess: () => { toast({ title: "Category updated" }); setDialogOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
      );
    } else {
      createCategory.mutate(
        { data: payload },
        { onSuccess: () => { toast({ title: "Category created" }); setDialogOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
      );
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteCategory.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Category deleted" });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-foreground">Categories</h1>
          <Button onClick={openCreate} className="bg-primary text-primary-foreground gap-2" data-testid="button-add-category">
            <Plus className="h-4 w-4" /> Add Category
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
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Slug</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Description</th>
                    <th className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data ?? []).map((cat, i) => (
                    <motion.tr
                      key={cat.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                      data-testid={`row-category-${cat.id}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                      <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">
                        {cat.description ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(cat)}
                            data-testid={`button-edit-category-${cat.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(cat.id, cat.name)}
                            data-testid={`button-delete-category-${cat.id}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {(data ?? []).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-muted-foreground">
                        <p className="font-serif text-xl mb-2">No categories yet</p>
                        <p className="text-sm">Add your first category to organize products</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category form dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                {editingId ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="c-name">Name *</Label>
                <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="input-category-name" />
              </div>
              <div>
                <Label htmlFor="c-slug">Slug *</Label>
                <Input id="c-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. moroccan-pottery" data-testid="input-category-slug" required />
              </div>
              <div>
                <Label htmlFor="c-desc">Description</Label>
                <Textarea id="c-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} data-testid="input-category-description" />
              </div>
              <div>
                <Label htmlFor="c-image">Image URL</Label>
                <Input id="c-image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." data-testid="input-category-image" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground"
                  disabled={createCategory.isPending || updateCategory.isPending}
                  data-testid="button-save-category"
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