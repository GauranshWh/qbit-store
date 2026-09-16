export default function Navbar() {
  return (
    <nav className="border-b p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Company Store</div>
        <div className="space-x-4">
          <a href="/products" className="hover:underline">Products</a>
          <a href="/solutions" className="hover:underline">Solutions</a>
          <a href="/resources" className="hover:underline">Resources</a>
          <a href="/cart" className="hover:underline">Cart</a>
        </div>
      </div>
    </nav>
  );
}
