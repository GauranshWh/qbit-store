import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16 text-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="relative w-72 h-16 flex items-center">
              <Image 
                src="/logo.png" 
                alt="Company Store Logo" 
                fill 
                className="object-contain object-left opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-muted-foreground mt-4">
              Providing ultra-low-latency infrastructure and highly reliable network equipment to quantitative trading firms and enterprise clients worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Products</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/products/hft-server" className="hover:text-primary transition-colors">HFT Servers</Link></li>
              <li><Link href="/products/firewall" className="hover:text-primary transition-colors">Firewalls</Link></li>
              <li><Link href="/products/switch" className="hover:text-primary transition-colors">Switches</Link></li>
              <li><Link href="/products/storage" className="hover:text-primary transition-colors">Storage Solutions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/solutions" className="hover:text-primary transition-colors">Our Solutions</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><span className="text-foreground">Sales:</span> sales@companystore.placeholder</li>
              <li><span className="text-foreground">Support:</span> support@companystore.placeholder</li>
              <li><span className="text-foreground">Phone:</span> +1 (555) 123-4567</li>
              <li className="pt-2">
                <Link href="/quote" className="text-primary font-medium hover:underline">
                  Request a Custom Quote &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Company Store. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
