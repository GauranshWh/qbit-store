"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { buttonVariants } from "@/components/ui/button";

interface AddToCartButtonProps {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    stock: number | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stock !== null && product.stock === 0;

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={buttonVariants({
        size: "lg",
        className: `w-full text-lg ${added ? "bg-green-600 hover:bg-green-700 text-white" : ""}`,
      })}
    >
      {isOutOfStock ? "Out of Stock" : added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
