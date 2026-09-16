import { notFound } from "next/navigation";
import { prisma as db } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpecTable from "@/components/product/SpecTable";
import ProductCard from "@/components/product/ProductCard";

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { active: true },
    select: { slug: true, category: true },
  });

  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ category: string; slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });
  
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Company Store`,
    description: product.shortDesc,
  };
}

export default async function ProductDetailPage(
  props: { params: Promise<{ category: string; slug: string }> }
) {
  const params = await props.params;
  const { category, slug } = params;

  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product || product.category !== category || !product.active) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await db.product.findMany({
    where: { 
      category, 
      active: true,
      NOT: { slug }
    },
    take: 3,
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.shortDesc,
    "sku": product.slug,
    "offers": product.priceType === "FIXED" ? {
      "@type": "Offer",
      "price": (product.priceCents! / 100).toFixed(2),
      "priceCurrency": "USD",
      "availability": product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    } : undefined
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mb-6">
        <Link href={`/products/${category}`} className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
          &larr; Back to {category}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left Column: Image Gallery Placeholder */}
        <div className="bg-secondary rounded-xl aspect-square flex items-center justify-center border border-border">
          <p className="text-muted-foreground italic">[Product Image Gallery Placeholder]</p>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <Badge variant="outline" className="mb-4">{category}</Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-xl text-muted-foreground">{product.shortDesc}</p>
          </div>

          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            {product.priceType === "FIXED" ? (
              <div className="space-y-6">
                <div className="text-3xl font-bold text-foreground">
                  ${(product.priceCents! / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                {product.stock !== null && (
                  <p className="text-sm text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
                  </p>
                )}
                
                {/* TODO: Wire up real cart functionality */}
                <button 
                  className={buttonVariants({ size: "lg", className: "w-full text-lg" })}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-2xl font-semibold text-foreground">
                  Custom Configuration Required
                </div>
                <p className="text-muted-foreground">
                  This product requires a specialized setup tailored to your infrastructure needs.
                </p>
                <Link 
                  href={`/quote?product=${product.slug}`}
                  className={buttonVariants({ size: "lg", className: "w-full text-lg" })}
                >
                  Request Quote for this Configuration
                </Link>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{product.longDesc}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Technical Specifications</h3>
            <SpecTable specs={product.specs} />
          </div>

          {product.datasheetUrl && (
            <div>
              <Link 
                href={product.datasheetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                Download Datasheet
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12 mt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
