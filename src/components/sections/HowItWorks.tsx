"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HOW_IT_WORKS } from "@/lib/constants";

export function HowItWorks() {
  return (
    <section className="border-y border-[rgba(254,254,254,0.08)] bg-[#0e0e00] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="How It Works"
            title="From Ring to"
            highlight="Revenue"
            description="Four simple steps between a missed call and a booked appointment."
          />
        </FadeIn>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute top-12 right-[12.5%] left-[12.5%] hidden h-px bg-[rgba(254,254,254,0.12)] lg:block" />

          {HOW_IT_WORKS.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-[rgba(254,254,254,0.08)] bg-transparent p-6 transition-all duration-300 hover:border-[rgba(254,254,254,0.15)] hover:bg-[rgba(254,254,254,0.03)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fefefe] text-sm font-bold text-[#0e0e00]">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgba(254,254,254,0.5)]">{step.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

