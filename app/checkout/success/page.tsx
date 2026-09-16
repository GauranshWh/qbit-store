"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when the user lands on the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Thank you for your purchase. We have received your order and our provisioning team will begin processing it immediately. 
        You will receive an email confirmation with your receipt and tracking details shortly.
      </p>

      <div className="flex gap-4">
        <Link href="/products" className={buttonVariants({ size: "lg", className: "text-lg" })}>
          Continue Shopping
        </Link>
        <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg" })}>
          Contact Support
        </Link>
      </div>
    </div>
  );
}
