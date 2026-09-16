export default function Footer() {
  return (
    <footer className="border-t p-4 mt-8">
      <div className="container mx-auto text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Company Store. All rights reserved.
      </div>
    </footer>
  );
}
