"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ROI_METRICS } from "@/lib/constants";

function AnimatedMetric({ value, suffix }: { value: string; suffix: string }) {
  return (
    <span className="text-3xl font-semibold text-white md:text-4xl">
      {value}
      <span className="text-lg text-[rgba(254,254,254,0.5)]">{suffix}</span>
    </span>
  );
}

export function ROI() {
  const chartRef = useRef(null);
  const isInView = useInView(chartRef, { once: true });

  const chartData = [
    { month: "Jan", recovered: 85, booked: 52 },
    { month: "Feb", recovered: 102, booked: 61 },
    { month: "Mar", recovered: 118, booked: 74 },
    { month: "Apr", recovered: 127, booked: 89 },
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="ROI"
            title="Real Results,"
            highlight="Real Revenue"
            description="See the impact an AI receptionist delivers for a typical multi-location practice."
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROI_METRICS.map((metric, i) => (
            <FadeIn key={metric.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-[rgba(254,254,254,0.08)] bg-transparent p-6">
                <AnimatedMetric value={metric.value} suffix={metric.suffix} />
                <p className="mt-2 text-sm font-medium text-white">{metric.label}</p>
                <p className="mt-1 text-xs text-[rgba(254,254,254,0.5)]">{metric.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mt-8">
          <div
            ref={chartRef}
            className="overflow-hidden rounded-2xl border border-[rgba(254,254,254,0.08)] bg-transparent p-6 md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Monthly Performance</h3>
                <p className="text-sm text-[rgba(254,254,254,0.5)]">Missed calls recovered vs. appointments booked</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-white">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#fefefe]" />
                  Recovered
                </span>
                <span className="flex items-center gap-1.5 text-[rgba(254,254,254,0.5)]">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[rgba(254,254,254,0.4)]" />
                  Booked
                </span>
              </div>
            </div>

            <div className="flex h-48 items-end gap-6 md:h-56">
              {chartData.map((data, i) => (
                <div key={data.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center gap-1.5" style={{ height: "100%" }}>
                    <motion.div
                      className="w-full max-w-8 rounded-t-sm bg-[#fefefe]"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(data.recovered / 127) * 100}%` } : { height: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                    <motion.div
                      className="w-full max-w-8 rounded-t-sm bg-[rgba(254,254,254,0.4)]"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${(data.booked / 89) * 100}%` } : { height: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.15 + 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                  </div>
                  <span className="text-xs text-[rgba(254,254,254,0.5)]">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

