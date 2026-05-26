import { Link } from "wouter";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface Product {
    id: number;
    name: string;
    price: number;
    images: string[];
    categoryName?: string | null;
    stock: number;
    isFeatured?: boolean;
}

interface ProductCardProps {
    product: Product;
    index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { toggleItem, isInWishlist } = useWishlist();
    const { addItem } = useCart();
    const { toast } = useToast();
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0] ?? "",
            quantity: 1,
        });
        toast({ title: "Added to cart", description: product.name });
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product.id);
        toast({
            title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
            description: product.name,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            data-testid={`card-product-${product.id}`}
            className="group relative bg-card rounded-lg overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-serif">
                            {product.name[0]}
                        </div>
                    )}
                    {product.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
                            Featured
                        </Badge>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <span className="text-sm font-medium text-foreground">Out of Stock</span>
                        </div>
                    )}
                    <button
                        onClick={handleToggleWishlist}
                        data-testid={`button-wishlist-${product.id}`}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${inWishlist ? "fill-primary text-primary" : "text-foreground"}`}
                        />
                    </button>
                </div>

                <div className="p-4">
                    {product.categoryName && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            {product.categoryName}
                        </p>
                    )}
                    <h3 className="font-serif text-base font-medium text-foreground line-clamp-1 mb-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <span data-testid={`text-price-${product.id}`} className="text-lg font-semibold text-primary">
                            ${product.price.toFixed(2)}
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            data-testid={`button-add-cart-${product.id}`}
                            className="h-8 px-3 text-xs gap-1.5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        >
                            <ShoppingCart className="h-3 w-3" />
                            Add
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}