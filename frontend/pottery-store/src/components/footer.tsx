import { Link } from "wouter";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">Terres d&apos;Art</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Handcrafted pottery and artisan decor. Each piece tells a story of tradition,
              skill, and the beauty of the handmade.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {["All Products", "Moroccan Pottery", "Ceramic Art", "Artisan Decor", "New Arrivals"].map((item) => (
                <li key={item}>
                  <Link href="/products">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Info</h4>
            <ul className="space-y-2">
              {["About Us", "Craftsmanship", "Care Guide", "Shipping", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Terres d&apos;Art. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Handmade with care in Morocco
          </p>
        </div>
      </div>
    </footer>
  );
}
