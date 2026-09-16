import Link from "next/link";
import { Product } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

interface ProductCardProps {
  product: Pick<Product, "id" | "slug" | "name" | "category" | "shortDesc" | "priceType" | "priceCents">;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    "hft-server": "HFT Server",
    "firewall": "Firewall",
    "switch": "Switch",
    "storage": "Storage",
    "other": "Other",
  };

  const formatPrice = (cents: number | null) => {
    if (!cents) return "Custom Quote";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Card className="flex flex-col h-full border-border bg-card">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {categoryLabels[product.category] || product.category}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {product.priceType === "FIXED" ? formatPrice(product.priceCents) : "Quote Required"}
          </span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">{product.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2 mt-2">
          {product.shortDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* We can put an image placeholder here if desired, or extra specs */}
        <div className="w-full h-32 bg-secondary/50 rounded-md flex items-center justify-center text-muted-foreground">
          <span className="text-xs uppercase tracking-widest">[Image Placeholder]</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Link href={`/products/${product.category}/${product.slug}`} className={buttonVariants({ className: "w-full bg-primary text-primary-foreground hover:bg-primary/90" })}>
          View Specifications
        </Link>
      </CardFooter>
    </Card>
  );
}
