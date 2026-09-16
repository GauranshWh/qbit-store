"use client";

import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export default function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.itemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || itemCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
      {itemCount}
    </span>
  );
}
