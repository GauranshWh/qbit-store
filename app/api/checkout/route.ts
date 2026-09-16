import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CartItem } from "@/lib/cart-store";

const getAppUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return "http://localhost:3000";
};

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            slug: item.slug,
          },
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        // Store stringified items to reconstruct the order in the webhook
        cartItems: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            priceCents: i.priceCents,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
