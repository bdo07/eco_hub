import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);

  const [searchTerm, setSearchTerm] = useState(params.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(params.get("category") ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: categoriesData } = useListCategories();
  const { data, isLoading } = useListProducts({
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
    inStock: inStockOnly || undefined,
    page,
    limit: 12,
  });

  useEffect(() => { setPage(1); }, [searchTerm, selectedCategory, priceRange, inStockOnly]);

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">Category</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setSelectedCategory("")}
              data-testid="filter-category-all"
              className={`text-sm transition-colors ${!selectedCategory ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              All Products
            </button>
          </li>
          {(categoriesData ?? []).map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                data-testid={`filter-category-${cat.slug}`}
                className={`text-sm transition-colors ${selectedCategory === cat.slug ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
          Price Range — ${priceRange[0]} – ${priceRange[1]}
        </h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="mt-2"
          data-testid="filter-price-range"
        />
      </div>

      {/* In stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(c) => setInStockOnly(!!c)}
          data-testid="filter-in-stock"
        />
        <label htmlFor="in-stock" className="text-sm text-muted-foreground cursor-pointer">
          In stock only
        </label>
      </div>

      {/* Reset */}
      {(selectedCategory || inStockOnly || priceRange[0] > 0 || priceRange[1] < 500) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedCategory("");
            setInStockOnly(false);
            setPriceRange([0, 500]);
          }}
          data-testid="button-reset-filters"
          className="text-muted-foreground gap-2"
        >
          <X className="h-3 w-3" /> Reset filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-serif text-4xl text-foreground mb-2">The Collection</h1>
          <p className="text-muted-foreground">Handcrafted pottery and artisan decor from Morocco</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + mobile filter toggle */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pieces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Button
            variant="outline"
            className="lg:hidden gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Active filter badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categoriesData?.find(c => c.slug === selectedCategory)?.name ?? selectedCategory}
              <button onClick={() => setSelectedCategory("")}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {inStockOnly && (
            <Badge variant="secondary" className="gap-1">
              In stock <button onClick={() => setInStockOnly(false)}><X className="h-3 w-3" /></button>
            </Badge>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterPanel />
          </aside>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setSidebarOpen(false)}>
              <div
                className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-border p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-foreground">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : data?.items.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-serif text-2xl text-muted-foreground mb-2">No pieces found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {data?.total ?? 0} pieces found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.items.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(i + 1)}
                        data-testid={`button-page-${i + 1}`}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
