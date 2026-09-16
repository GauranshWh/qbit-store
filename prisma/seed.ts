import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const products = [
    {
      slug: "hft-titan-x",
      name: "Titan X HFT Server",
      category: "hft-server",
      shortDesc: "Ultra-low latency server for high-frequency trading.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nThe Titan X delivers sub-microsecond latency, featuring an overclocked CPU and liquid cooling, specifically designed for quantitative trading firms.",
      specs: {
        cpu: "Intel Core i9-14900KS (Overclocked)",
        ram: "64GB DDR5 7200MHz",
        nic: "Solarflare X2522 Dual Port 10/25GbE",
        formFactor: "1U Rackmount"
      },
      priceType: "QUOTE",
      active: true,
      images: []
    },
    {
      slug: "hft-quantum-edge",
      name: "Quantum Edge HFT Node",
      category: "hft-server",
      shortDesc: "Optimized for maximum tick processing.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nQuantum Edge provides the ultimate edge in market data processing with specialized FPGA accelerators.",
      specs: {
        cpu: "AMD Ryzen 9 7950X3D",
        ram: "128GB DDR5 6000MHz",
        nic: "Mellanox ConnectX-6 Dx",
        formFactor: "2U Rackmount"
      },
      priceType: "QUOTE",
      active: true,
      images: []
    },
    {
      slug: "hft-nano-trader",
      name: "NanoTrader Pro",
      category: "hft-server",
      shortDesc: "Compact and efficient HFT solution.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nA compact trading server that doesn't compromise on speed, perfect for co-location facilities with limited space.",
      specs: {
        cpu: "Intel Xeon E-2388G",
        ram: "32GB ECC DDR4",
        nic: "ExaNIC X10",
        formFactor: "Half-U Rackmount"
      },
      priceType: "FIXED",
      priceCents: 1250000,
      stock: 5,
      active: true,
      images: []
    },
    {
      slug: "fw-secure-gate-500",
      name: "SecureGate 500",
      category: "firewall",
      shortDesc: "Next-gen enterprise firewall.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nAdvanced threat protection with Deep Packet Inspection for enterprise networks.",
      specs: {
        throughput: "10 Gbps",
        ports: "8x 1GbE, 4x 10GbE SFP+",
        features: ["DPI", "VPN", "IPS/IDS"]
      },
      priceType: "FIXED",
      priceCents: 350000,
      stock: 12,
      active: true,
      images: []
    },
    {
      slug: "fw-secure-gate-1000",
      name: "SecureGate 1000",
      category: "firewall",
      shortDesc: "High-throughput data center firewall.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nDesigned for core network security with massive throughput capabilities.",
      specs: {
        throughput: "40 Gbps",
        ports: "12x 10GbE SFP+, 4x 40GbE QSFP+",
        features: ["Zero-Trust", "Advanced Routing"]
      },
      priceType: "QUOTE",
      active: true,
      images: []
    },
    {
      slug: "fw-edge-defender",
      name: "Edge Defender Nano",
      category: "firewall",
      shortDesc: "Branch office security appliance.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nPlug-and-play security for remote locations and small offices.",
      specs: {
        throughput: "2 Gbps",
        ports: "6x 1GbE RJ45",
        features: ["SD-WAN", "Web Filtering"]
      },
      priceType: "FIXED",
      priceCents: 85000,
      stock: 45,
      active: true,
      images: []
    },
    {
      slug: "sw-nexus-ultra",
      name: "Nexus Ultra Switch",
      category: "switch",
      shortDesc: "100GbE Top-of-Rack Switch.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nHigh-density 100GbE switching for modern data centers and cloud deployments.",
      specs: {
        ports: "32x 100GbE QSFP28",
        switchingCapacity: "6.4 Tbps",
        latency: "450ns"
      },
      priceType: "QUOTE",
      active: true,
      images: []
    },
    {
      slug: "sw-core-connect-48",
      name: "CoreConnect 48G",
      category: "switch",
      shortDesc: "48-port Gigabit PoE+ Switch.",
      longDesc: "[PLACEHOLDER COPY - replace with verified specs]\nReliable access-layer switching with PoE support for IP cameras and APs.",
      specs: {
        ports: "48x 1GbE PoE+, 4x 10GbE SFP+",
        poeBudget: "740W",
        layer: "L2+"
      },
      priceType: "FIXED",
      priceCents: 120000,
      stock: 20,
      active: true,
      images: []
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
