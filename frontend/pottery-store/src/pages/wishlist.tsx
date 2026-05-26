import { Link } from "wouter";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { useWishlist } from "@/lib/wishlist-context";
import { useListProducts } from "@workspace/api-client-react";

export default function Wishlist() {
  const { items } = useWishlist();
  const { data, isLoading } = useListProducts({ limit: 100 });

  const wishlistProducts = (data?.items ?? []).filter((p) => items.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Button>
          </Link>
          <h1 className="font-serif text-3xl text-foreground">Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-foreground mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Save pieces you love for later</p>
            <Link href="/products">
              <Button size="lg" className="bg-primary text-primary-foreground">
                Browse Collection
              </Button>
            </Link>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
