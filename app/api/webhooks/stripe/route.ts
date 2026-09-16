import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma as db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    try {
      const items = session.metadata?.cartItems 
        ? JSON.parse(session.metadata.cartItems) 
        : [];
      
      const email = session.customer_details?.email || "";

      await db.order.create({
        data: {
          stripeSessionId: session.id,
          email: email,
          items: items,
          totalCents: session.amount_total || 0,
          status: "PAID",
        },
      });
      
    } catch (error: any) {
      console.error("[ORDER_CREATION_ERROR]", error.message);
      return new NextResponse(`Order Creation Error: ${error.message}`, { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
