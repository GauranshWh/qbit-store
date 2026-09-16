import Link from "next/link";
import { prisma as db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryFilter = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const priceTypeFilter = typeof searchParams.priceType === "string" ? searchParams.priceType : undefined;

  // Build the where clause dynamically
  const where: Prisma.ProductWhereInput = { active: true };
  if (categoryFilter) where.category = categoryFilter;
  if (priceTypeFilter) where.priceType = priceTypeFilter;

  const products = await db.product.findMany({
    where,
    orderBy: { name: "asc" },
  });

  const categories = [
    { label: "All Categories", value: "" },
    { label: "HFT Servers", value: "hft-server" },
    { label: "Firewalls", value: "firewall" },
    { label: "Switches", value: "switch" },
    { label: "Storage", value: "storage" },
  ];

  const priceTypes = [
    { label: "All Pricing", value: "" },
    { label: "Fixed Price", value: "FIXED" },
    { label: "Custom Quote", value: "QUOTE" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">Product Catalog</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Browse our complete range of enterprise-grade trading infrastructure, networking equipment, and secure storage solutions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => {
                const isActive = (categoryFilter || "") === cat.value;
                const search = new URLSearchParams();
                if (cat.value) search.set("category", cat.value);
                if (priceTypeFilter) search.set("priceType", priceTypeFilter);
                const href = `/products${search.toString() ? `?${search.toString()}` : ""}`;

                return (
                  <li key={cat.value}>
                    <Link
                      href={href}
                      className={`block px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground mb-4">Pricing</h3>
            <ul className="space-y-2">
              {priceTypes.map((pt) => {
                const isActive = (priceTypeFilter || "") === pt.value;
                const search = new URLSearchParams();
                if (categoryFilter) search.set("category", categoryFilter);
                if (pt.value) search.set("priceType", pt.value);
                const href = `/products${search.toString() ? `?${search.toString()}` : ""}`;

                return (
                  <li key={pt.value}>
                    <Link
                      href={href}
                      className={`block px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {pt.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {(categoryFilter || priceTypeFilter) && (
            <div className="pt-4 border-t border-border">
              <Link 
                href="/products"
                className={buttonVariants({ variant: "outline", className: "w-full" })}
              >
                Clear Filters
              </Link>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">We couldn&apos;t find any products matching your current filters.</p>
              <Link href="/products" className={buttonVariants({ variant: "default" })}>
                Clear Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
