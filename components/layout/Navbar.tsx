import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Company Store</div>
        <div className="space-x-4">
          <Link href="/products" className="hover:underline">Products</Link>
          <Link href="/solutions" className="hover:underline">Solutions</Link>
          <Link href="/resources" className="hover:underline">Resources</Link>
          <Link href="/cart" className="hover:underline">Cart</Link>
        </div>
      </div>
    </nav>
  );
}
