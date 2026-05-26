import { Link } from "wouter";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { useGetFeaturedProducts, useListCategories } from "@workspace/api-client-react";

export default function Home() {
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedProducts();
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-muted dark:bg-muted/20 min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4">
              Handcrafted with Soul
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-foreground leading-tight mb-6">
              Where Earth
              <br />
              <em className="text-primary">Becomes Art</em>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
              Each piece is shaped by hand, fired with care, and born from centuries of Moroccan craft tradition. 
              Bring the warmth of the atelier into your home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" data-testid="button-shop-now">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8">
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=moroccan-pottery">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  Moroccan Pottery
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
{featured && featured.length > 0 ? (
               featured.slice(0, 4).map((product, i) => (
                 <Link key={product.id} href={`/products/${product.id}`}>
                   <div
                     className={`relative overflow-hidden rounded-xl bg-muted aspect-square cursor-pointer group ${i === 0 ? "row-span-2" : ""}`}
                   >
                     {product.images[0] ? (
                       <img
                         src={product.images[0]}
                         alt={product.name}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                       />
                     ) : (
                       <div className="w-full h-full bg-muted" />
                     )}
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                 </Link>
               ))
             ) : (
               <>
                 <div className="row-span-2 rounded-xl bg-muted aspect-square animate-pulse" />
                 <div className="rounded-xl bg-muted aspect-square animate-pulse" />
                 <div className="rounded-xl bg-muted aspect-square animate-pulse" />
               </>
             )}
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Unique Pieces" },
              { value: "15+", label: "Artisan Families" },
              { value: "30+", label: "Countries Shipped" },
              { value: "100%", label: "Handmade" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl font-light">{stat.value}</p>
                <p className="text-primary-foreground/70 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-2">Browse</p>
            <h2 className="font-serif text-4xl text-foreground">Our Collections</h2>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" data-testid="link-view-all-categories">
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categories ?? []).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/products?category=${cat.slug}`} data-testid={`link-category-${cat.id}`}>
                  <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-muted">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-stone-700 dark:to-stone-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-serif text-white text-lg font-medium">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-2">Curated Selection</p>
              <h2 className="font-serif text-4xl text-foreground">Featured Pieces</h2>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" data-testid="link-view-all-featured">
                View all <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featured ?? []).slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

{/* Gallery strip */}
       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="text-center mb-10">
           <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-2">Instagram</p>
           <h2 className="font-serif text-4xl text-foreground">From the Studio</h2>
         </div>
         <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
           {(featured ?? []).slice(0, 5).map((product) => (
             <Link key={product.id} href={`/products/${product.id}`}>
               <div className="aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer group">
                 {product.images[0] ? (
                   <img
                     src={product.images[0]}
                     alt={product.name}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                 ) : (
                   <div className="w-full h-full bg-muted" />
                 )}
               </div>
             </Link>
           ))}
         </div>
       </section>

      {/* CTA */}
      <section className="bg-card border-y border-border py-20 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-4xl text-foreground mb-4">Order via WhatsApp</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Add your favorite pieces to the cart, fill in your details, and we&apos;ll send your order directly 
            to our artisans via WhatsApp. No accounts needed.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground gap-2">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
