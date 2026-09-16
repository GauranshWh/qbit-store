import { NextResponse } from "next/server";
import { quoteSchema } from "@/lib/schemas";
import { prisma as db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Simple in-memory rate limiting (Note: Move to Upstash Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    if (!checkRateLimit(ip)) {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    const result = quoteSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request payload", { status: 400 });
    }

    const {
      companyName,
      contactName,
      email,
      phone,
      productInterest,
      quantity,
      budget,
      timeline,
      requirements,
      honeypot,
    } = result.data;

    // Honeypot check for bots
    if (honeypot && honeypot.length > 0) {
      // Silently accept but do nothing
      return new NextResponse("Quote submitted", { status: 200 });
    }

    const requirementsJson = {
      budget: budget || null,
      timeline: timeline || null,
      quantity: quantity || null,
      details: requirements,
    };

    const quote = await db.quote.create({
      data: {
        companyName,
        contactName,
        email,
        phone: phone || null,
        productSlug: productInterest,
        requirements: requirementsJson,
      },
    });

    // Send Emails
    const salesEmail = process.env.SALES_EMAIL || "sales@example.com";
    
    const internalEmailContent = `
      New Quote Request (${quote.id})
      -----------------------------
      Company: ${companyName}
      Contact: ${contactName}
      Email: ${email}
      Phone: ${phone || 'N/A'}
      Product Interest: ${productInterest}
      Quantity: ${quantity || 'N/A'}
      Budget: ${budget || 'N/A'}
      Timeline: ${timeline || 'N/A'}
      
      Requirements:
      ${requirements}
    `;

    const customerEmailContent = `
      Hi ${contactName},
      
      Thank you for requesting a quote from Company Store. We have received your requirements for ${productInterest} and our engineering team is reviewing them.
      
      You can expect a response from us within 1 business day.
      
      Best regards,
      Company Store Sales Team
    `;

    if (resend) {
      await resend.emails.send({
        from: "Company Store <sales@companystore.com>", // Replace with a verified domain in prod
        to: salesEmail,
        subject: `New Quote Request from ${companyName}`,
        text: internalEmailContent,
      });

      await resend.emails.send({
        from: "Company Store <sales@companystore.com>", 
        to: email,
        subject: "We received your quote request",
        text: customerEmailContent,
      });
    } else {
      console.log("[DEV MODE] Would send internal email:", internalEmailContent);
      console.log("[DEV MODE] Would send customer email:", customerEmailContent);
    }

    return new NextResponse("Quote submitted successfully", { status: 200 });
  } catch (error) {
    console.error("[QUOTE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
