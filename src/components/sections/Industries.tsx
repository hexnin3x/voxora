"use client";

import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRIES } from "@/lib/constants";

export function Industries() {
  return (
    <section id="industries" className="border-y border-[rgba(254,254,254,0.08)] bg-[#0e0e00] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="Industries"
            title="Built for Businesses That"
            highlight="Depend on Calls"
            description="Tailored AI agents for the industries where every call counts."
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, i) => (
            <FadeIn key={industry.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-[rgba(254,254,254,0.08)] bg-transparent p-6 transition-all duration-300 hover:border-[rgba(254,254,254,0.15)] hover:bg-[rgba(254,254,254,0.03)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(254,254,254,0.08)]">
                  <industry.icon className="h-6 w-6 text-[#fefefe]" />
                </div>
                <h3 className="text-lg font-semibold text-white">{industry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgba(254,254,254,0.5)]">{industry.description}</p>
                <ul className="mt-6 space-y-2">
                  {industry.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-[rgba(254,254,254,0.5)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#fefefe]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
