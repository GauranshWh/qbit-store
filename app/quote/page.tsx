"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { quoteSchema, QuoteFormData } from "@/lib/schemas";
import { z } from "zod";
import { buttonVariants } from "@/components/ui/button";

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});
  
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    productInterest: searchParams.get("product") || "",
    quantity: undefined as any,
    budget: "",
    timeline: "",
    requirements: "",
    honeypot: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? (value === "" ? undefined : parseInt(value, 10)) : value,
    }));
    // Clear error on change
    if (errors[name as keyof QuoteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (currentStep: number) => {
    try {
      if (currentStep === 1) {
        quoteSchema.pick({ companyName: true, contactName: true, email: true, phone: true }).parse(formData);
      } else if (currentStep === 2) {
        quoteSchema.pick({ productInterest: true, quantity: true, budget: true, timeline: true }).parse(formData);
      } else if (currentStep === 3) {
        quoteSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof QuoteFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/quote/success");
      } else {
        const errorText = await response.text();
        setErrors({ requirements: `Failed to submit quote: ${errorText}` });
      }
    } catch (error) {
      setErrors({ requirements: "A network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card border border-border p-8 rounded-xl shadow-sm">
      {/* Honeypot field - visually hidden */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="honeypot">Leave this field empty</label>
        <input type="text" id="honeypot" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>1</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-secondary"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>2</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-secondary"}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>3</div>
        </div>
        <h2 className="text-2xl font-bold text-foreground text-center">
          {step === 1 && "Company Information"}
          {step === 2 && "Project Details"}
          {step === 3 && "Final Requirements"}
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Company Name *</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contact Name *</label>
            <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">What are you looking for? *</label>
            <select name="productInterest" value={formData.productInterest} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground">
              <option value="">Select an option</option>
              <option value="hft-server">HFT Servers</option>
              <option value="firewall">Enterprise Firewalls</option>
              <option value="switch">Network Switches</option>
              <option value="storage">Secure Storage</option>
              <option value="custom">Custom Infrastructure Solution</option>
              {formData.productInterest && !["hft-server", "firewall", "switch", "storage", "custom"].includes(formData.productInterest) && (
                <option value={formData.productInterest}>{formData.productInterest} (from link)</option>
              )}
            </select>
            {errors.productInterest && <p className="text-red-500 text-sm mt-1">{errors.productInterest}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Estimated Quantity *</label>
            <input type="number" min="1" name="quantity" value={formData.quantity || ""} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Budget Range</label>
            <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground">
              <option value="">Select a range</option>
              <option value="<50k">&lt; $50,000</option>
              <option value="50k-250k">$50,000 - $250,000</option>
              <option value="250k-1m">$250,000 - $1,000,000</option>
              <option value="1m+">$1,000,000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Implementation Timeline</label>
            <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground">
              <option value="">Select a timeline</option>
              <option value="immediate">Immediate (ASAP)</option>
              <option value="1-3-months">1 - 3 Months</option>
              <option value="3-6-months">3 - 6 Months</option>
              <option value="6-months+">6+ Months</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Detailed Requirements *</label>
            <textarea 
              name="requirements" 
              value={formData.requirements} 
              onChange={handleChange} 
              rows={5}
              placeholder="Please describe your specific latency requirements, workload details, and any custom hardware configurations..."
              className="w-full p-2 rounded bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none" 
            />
            {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
          </div>

          <div className="bg-secondary p-4 rounded text-sm text-foreground">
            <h4 className="font-bold mb-2">Review Summary:</h4>
            <p><span className="text-muted-foreground">Company:</span> {formData.companyName}</p>
            <p><span className="text-muted-foreground">Contact:</span> {formData.contactName} ({formData.email})</p>
            <p><span className="text-muted-foreground">Interest:</span> {formData.productInterest}</p>
            <p><span className="text-muted-foreground">Quantity:</span> {formData.quantity}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button onClick={prevStep} className={buttonVariants({ variant: "outline" })}>
            Back
          </button>
        ) : (
          <div></div> // Spacer
        )}
        
        {step < 3 ? (
          <button onClick={nextStep} className={buttonVariants({ variant: "default" })}>
            Continue
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className={buttonVariants({ variant: "default" })}>
            {isSubmitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Request a Custom Quote</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our engineering team works closely with you to design and provision the optimal infrastructure for your latency-critical workloads.
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-muted-foreground">Loading form...</div>}>
        <QuoteFormContent />
      </Suspense>
    </div>
  );
}
