import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex justify-between items-center h-20 px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* Fallback to text if image fails to load during dev, but use next/image for the logo */}
          <div className="relative w-72 h-16 flex items-center">
             <Image 
               src="/logo.png" 
               alt="Company Store Logo" 
               fill 
               className="object-contain object-left"
               priority
             />
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-foreground">
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link>
          <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span className="sr-only">Cart</span>
          </Link>
          <Link href="/quote" className={buttonVariants({ className: "bg-primary text-primary-foreground hover:bg-primary/90" })}>
            Request a Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
