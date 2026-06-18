"use client";

import { Pricing as PricingUI } from "@/components/ui/pricing";

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$299",
    yearlyPrice: "$239",
    period: "mo",
    description: "Perfect for single-location businesses getting started with AI.",
    features: [
      "AI Receptionist agent",
      "500 call minutes/month",
      "Appointment scheduling",
      "SMS confirmations",
      "Basic analytics dashboard",
      "Email support",
    ],
    buttonText: "Get Started",
    href: "#contact",
    isPopular: false,
  },
  {
    name: "Professional",
    price: "$599",
    yearlyPrice: "$479",
    period: "mo",
    description: "For growing businesses that need integrations and higher volume.",
    features: [
      "Everything in Starter",
      "2,000 call minutes/month",
      "Custom CRM integrations",
      "Call transfer routing",
      "Multi-language support",
      "Priority support",
    ],
    buttonText: "Book Demo",
    href: "#contact",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    yearlyPrice: "Custom",
    period: "mo",
    description: "Tailored solutions for multi-location and high-volume operations.",
    features: [
      "Unlimited call volume",
      "Dedicated success manager",
      "Custom voice & personality",
      "SLA guarantees",
      "Advanced analytics & API",
      "White-glove onboarding",
    ],
    buttonText: "Contact Sales",
    href: "#contact",
    isPopular: false,
  },
];

export function Pricing() {
  return (
    <PricingUI
      plans={PRICING_PLANS}
      title="Simple, Transparent Pricing"
      description="Choose the plan that fits your call volume. All plans include setup, training, and ongoing support."
    />
  );
}

