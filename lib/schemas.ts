import { z } from "zod";

export const quoteSchema = z.object({
  companyName: z.string().min(2, "Company name is required (min 2 chars)"),
  contactName: z.string().min(2, "Contact name is required (min 2 chars)"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  productInterest: z.string().min(1, "Please select what you are looking for"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").optional().or(z.nan()),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().min(10, "Please provide more details (min 10 chars)"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
