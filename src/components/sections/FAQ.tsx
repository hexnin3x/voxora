"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="FAQ"
            title="Common"
            highlight="Questions"
            description="Everything you need to know before getting started."
          />
        </FadeIn>

        <div className="mt-12 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={item.question} delay={i * 0.05}>
              <div className="overflow-hidden rounded-xl border border-[rgba(254,254,254,0.08)] bg-transparent">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  data-magnetic
                  className="flex w-full items-center justify-between px-6 py-5 text-left cursor-none"
                >
                  <span className="pr-4 text-sm font-medium text-white md:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-[rgba(254,254,254,0.5)] transition-transform duration-200",
                      openIndex === i && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-[rgba(254,254,254,0.5)]">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

