import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma as db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export default async function MarketingHomePage() {
  // Fetch featured products
  const featuredProducts = await db.product.findMany({
    where: { active: true },
    take: 3,
    orderBy: { createdAt: "asc" }, // Deterministic order for featured
  });

  // Group by category to show counts in category tiles
  const categoryGroups = await db.product.groupBy({
    by: ["category"],
    where: { active: true },
    _count: { category: true },
  });

  const getCategoryCount = (cat: string) => {
    return categoryGroups.find((g) => g.category === cat)?._count.category || 0;
  };

  const categories = [
    { name: "HFT Servers", slug: "hft-server", count: getCategoryCount("hft-server") },
    { name: "Firewalls", slug: "firewall", count: getCategoryCount("firewall") },
    { name: "Switches", slug: "switch", count: getCategoryCount("switch") },
    { name: "Storage", slug: "storage", count: getCategoryCount("storage") },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full bg-secondary py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-4xl mb-6 leading-tight">
            Ultra-Low-Latency Infrastructure for Global Trading Firms
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Enterprise-grade hardware engineered for microseconds. Accelerate your trading strategies with our specialized network and compute solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className={buttonVariants({ size: "lg", className: "bg-primary text-primary-foreground hover:bg-primary/90" })}>
              Browse Products
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg", className: "bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background" })}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="w-full py-12 border-b border-border bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            [PLACEHOLDER - Trusted by the world&apos;s leading quantitative funds]
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-36 bg-muted rounded"></div>
            <div className="h-8 w-28 bg-muted rounded"></div>
            <div className="h-8 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Explore Our Infrastructure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/products/${cat.slug}`} className="group block h-full">
                <Card className="h-full border-border bg-card hover:border-primary transition-colors cursor-pointer group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {cat.count} product{cat.count !== 1 ? 's' : ''} available
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="w-full py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Sub-Microsecond Latency</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>[PLACEHOLDER STAT: 142ns port-to-port latency on our flagship Layer 1 switches.]</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">24/7 Global Support</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>Direct lines to L3 network engineers for all mission-critical deployments. No tiered support queues.</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Enterprise Compliance</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>[PLACEHOLDER STAT: ISO 27001 certified facilities and full SEC/FINRA hardware compliance records.]</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <Link href="/products" className="hidden sm:block text-primary font-medium hover:underline">
              View all products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 sm:hidden flex justify-center">
            <Link href="/products" className={buttonVariants({ variant: "outline", className: "w-full border-foreground text-foreground" })}>
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Need a custom configuration?</h2>
            <p className="text-primary-foreground/80 text-lg">Our engineering team can build to your exact latency and throughput requirements.</p>
          </div>
          <Link href="/quote" className={buttonVariants({ size: "lg", variant: "secondary", className: "bg-background text-foreground hover:bg-background/90 whitespace-nowrap" })}>
            Request Custom Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
