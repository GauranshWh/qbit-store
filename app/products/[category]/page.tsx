import { notFound } from "next/navigation";
import { prisma as db } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import { Metadata } from "next";
import Link from "next/link";

const CATEGORY_INFO: Record<string, { title: string; description: string }> = {
  "hft-server": {
    title: "HFT Servers",
    description: "In quantitative trading, every microsecond matters. Our HFT servers are meticulously engineered with overclocked processors, specialized NICs, and aggressive cooling to ensure your algorithms execute faster than the competition."
  },
  "firewall": {
    title: "Enterprise Firewalls",
    description: "Protect your mission-critical infrastructure with our advanced enterprise firewalls. Designed for massive throughput and deep packet inspection without introducing unacceptable latency overhead into your network."
  },
  "switch": {
    title: "Network Switches",
    description: "Ultra-low-latency layer 1/2/3 switching fabrics. Built for the rigorous demands of algorithmic trading, core data center routing, and high-frequency market data distribution."
  },
  "storage": {
    title: "Secure Storage",
    description: "High-IOPS, nvme-backed storage arrays built for tick data capture, real-time analytics, and secure historical backtesting repositories."
  }
};

export async function generateStaticParams() {
  return [
    { category: "hft-server" },
    { category: "firewall" },
    { category: "switch" },
    { category: "storage" },
  ];
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const info = CATEGORY_INFO[params.category];
  
  if (!info) return { title: "Category Not Found" };

  return {
    title: `${info.title} | Company Store`,
    description: info.description,
  };
}

export default async function CategoryPage(
  props: { params: Promise<{ category: string }> }
) {
  const params = await props.params;
  const category = params.category;
  const info = CATEGORY_INFO[category];

  if (!info) {
    notFound();
  }

  const products = await db.product.findMany({
    where: { category, active: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
          &larr; Back to all products
        </Link>
      </div>
      
      <div className="mb-12 bg-secondary rounded-xl p-8 border border-border">
        <h1 className="text-4xl font-bold text-foreground mb-4">{info.title}</h1>
        <p className="text-muted-foreground text-lg max-w-4xl">
          {info.description}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">No products available</h3>
          <p className="text-muted-foreground">We are currently updating our inventory for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
