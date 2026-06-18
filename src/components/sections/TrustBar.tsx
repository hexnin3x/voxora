"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { TRUST_ITEMS } from "@/lib/constants";

export function TrustBar() {
  return (
    <section className="border-y border-[rgba(254,254,254,0.08)] bg-[#0e0e00] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {TRUST_ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="group text-center lg:text-left">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(254,254,254,0.06)] border border-[rgba(254,254,254,0.08)] transition-all duration-300 group-hover:bg-[rgba(254,254,254,0.12)] group-hover:border-[rgba(254,254,254,0.18)] lg:mx-0">
                  <item.icon className="h-6 w-6 text-[#fefefe]" />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[rgba(254,254,254,0.5)]">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

