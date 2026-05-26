import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Heart, ShoppingCart, ChevronLeft, Minus, Plus, MessageCircle, Package, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";

const WHATSAPP_NUMBER = "1234567890";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = params?.id ?? "0";
  const { data: product, isLoading } = useGetProduct(id, {
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) },
  });

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity,
      colors: selectedColor ? [selectedColor] : undefined,
    });
    toast({ title: "Added to cart", description: `${quantity}x ${product.name}` });
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const msg = encodeURIComponent(
      `Hello! I'm interested in ordering:\n\n*${product.name}*\nQuantity: ${quantity}\nPrice: $${(product.price * quantity).toFixed(2)}${selectedColor ? `\nColor: ${selectedColor}` : ""}\n\nPlease let me know how to proceed.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-20 rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="font-serif text-2xl text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/">
            <span className="hover:text-foreground transition-colors cursor-pointer">Home</span>
          </Link>
          <span>/</span>
          <Link href="/products">
            <span className="hover:text-foreground transition-colors cursor-pointer">Shop</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="font-serif text-6xl text-primary/30">{product.name[0]}</span>
                </div>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
              )}
            </motion.div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    data-testid={`button-image-${i}`}
                    className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.categoryName && (
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">
                {product.categoryName}
              </p>
            )}
            <h1 className="font-serif text-4xl font-light text-foreground" data-testid="text-product-name">
              {product.name}
            </h1>
            <p className="font-serif text-3xl text-primary" data-testid="text-product-price">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {product.handmadeDetails && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-xs uppercase tracking-wider text-primary font-medium mb-2">Handmade Details</p>
                <p className="text-sm text-muted-foreground">{product.handmadeDetails}</p>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Color: <span className="text-muted-foreground">{selectedColor ?? "Select a color"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      data-testid={`button-color-${color}`}
                      className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-quantity-minus"
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span data-testid="text-quantity" className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  data-testid="button-quantity-plus"
                  className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <span className="text-sm text-muted-foreground">{product.stock} available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-testid="button-add-to-cart"
                className="flex-1 bg-primary text-primary-foreground gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => { toggleItem(product.id); }}
                data-testid="button-wishlist"
                className={`gap-2 ${inWishlist ? "border-primary text-primary" : ""}`}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? "fill-primary" : ""}`} />
              </Button>
            </div>

            <Button
              size="lg"
              onClick={handleWhatsApp}
              data-testid="button-whatsapp-order"
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Order on WhatsApp
            </Button>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4 text-primary shrink-0" />
                Handpacked with care
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                Worldwide shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}