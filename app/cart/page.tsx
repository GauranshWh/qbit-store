"use client";

import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, cartTotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Your Cart</h1>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-secondary rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-secondary rounded col-span-2"></div>
                <div className="h-2 bg-secondary rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-secondary rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-foreground mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any products yet.</p>
          <Link href="/products" className={buttonVariants({ size: "lg" })}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border border-border rounded-lg">
                <div className="w-24 h-24 bg-secondary rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">Image</span>
                </div>
                <div className="flex-1">
                  <Link href={`/products/hft-server/${item.slug}`} className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-muted-foreground mt-1">${(item.priceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded">
                    <button 
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-foreground min-w-[2rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="text-destructive hover:text-destructive/80 p-2"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 rounded-lg border border-border sticky top-24">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${(cartTotal() / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-foreground text-xl">
                  <span>Total</span>
                  <span>${(cartTotal() / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className={buttonVariants({ size: "lg", className: "w-full text-lg" })}
              >
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
