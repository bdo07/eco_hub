import { useState } from "react";
import { Link } from "wouter";
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from "@workspace/api-client-react";

const WHATSAPP_NUMBER = "1234567890";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  });
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.city || !form.address) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    // Save order to DB
    createOrder.mutate({
      data: {
        customerName: form.name,
        customerPhone: form.phone,
        customerCity: form.city,
        customerAddress: form.address,
        notes: form.notes,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      },
    });

    // Build WhatsApp message
    const itemsText = items
      .map((i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join("\n");

    const msg = encodeURIComponent(
      `Hello! I'd like to place an order:\n\n${itemsText}\n\n*Total: $${totalPrice.toFixed(2)}*\n\n---\n*Customer Details:*\nName: ${form.name}\nPhone: ${form.phone}\nCity: ${form.city}\nAddress: ${form.address}${form.notes ? `\nNotes: ${form.notes}` : ""}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    clearCart();
    toast({ title: "Order sent!", description: "Check your WhatsApp to complete the order." });
    setFormVisible(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-foreground mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Discover our handcrafted pottery collection</p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Explore Collection
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
          <h1 className="font-serif text-3xl text-foreground">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  data-testid={`cart-item-${item.productId}`}
                  className="flex gap-4 bg-card border border-card-border rounded-xl p-4"
                >
                  <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-sm text-primary mt-1">${item.price.toFixed(2)}</p>
                    {item.colors && item.colors.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Color: {item.colors.join(", ")}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        data-testid={`button-cart-minus-${item.productId}`}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center" data-testid={`text-cart-qty-${item.productId}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        data-testid={`button-cart-plus-${item.productId}`}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-semibold text-foreground" data-testid={`text-cart-subtotal-${item.productId}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      data-testid={`button-cart-remove-${item.productId}`}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-card border border-card-border rounded-xl p-6">
              <h2 className="font-serif text-xl text-foreground mb-4">Order Summary</h2>
              <div className="space-y-2 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm text-muted-foreground">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 font-semibold text-foreground">
                <span>Total</span>
                <span data-testid="text-cart-total" className="text-primary text-lg">${totalPrice.toFixed(2)}</span>
              </div>

              <Button
                size="lg"
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white gap-2"
                onClick={() => setFormVisible(!formVisible)}
                data-testid="button-checkout"
              >
                <MessageCircle className="h-4 w-4" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Checkout form */}
            <AnimatePresence>
              {formVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-card-border rounded-xl p-6 overflow-hidden"
                >
                  <h3 className="font-serif text-lg text-foreground mb-4">Your Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        data-testid="input-customer-name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        data-testid="input-customer-phone"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Your city"
                        data-testid="input-customer-city"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Full delivery address"
                        data-testid="input-customer-address"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Any special requests..."
                        data-testid="input-customer-notes"
                        rows={2}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 mt-2"
                      disabled={createOrder.isPending}
                      data-testid="button-send-whatsapp"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {createOrder.isPending ? "Sending..." : "Send Order on WhatsApp"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
