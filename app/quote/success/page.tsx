import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function QuoteSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-4">Quote Request Received!</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-8">
        Thank you for submitting your infrastructure requirements. Our engineering team will review your request and get back to you with a tailored solution and pricing within <span className="font-semibold text-foreground">1 business day</span>.
      </p>

      <div className="flex gap-4">
        <Link href="/" className={buttonVariants({ size: "lg", className: "text-lg" })}>
          Return Home
        </Link>
        <Link href="/products" className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg" })}>
          Browse More Products
        </Link>
      </div>
    </div>
  );
}
