"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DEMOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DemoSection() {
  const [activeId, setActiveId] = useState(DEMOS[0].id);
  const activeDemo = DEMOS.find((d) => d.id === activeId) ?? DEMOS[0];

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="Live Demos"
            title="See Your AI Receptionist"
            highlight="In Action"
            description="Watch real conversations across industries. Upload your own demo videos to /public/videos and they'll appear automatically."
          />
        </FadeIn>

        <FadeIn delay={0.2} className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-[rgba(254,254,254,0.08)] bg-[#1a1a0d] shadow-2xl ring-1 ring-white/5">
            <div className="relative aspect-video bg-[#0e0e00]">
              <video
                key={activeDemo.id}
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
              >
                <source src={activeDemo.video} type="video/mp4" />
              </video>
            </div>
            <div className="border-t border-[rgba(254,254,254,0.08)] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wide text-[rgba(254,254,254,0.5)] uppercase">
                    {activeDemo.category}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{activeDemo.title}</h3>
                  <p className="mt-2 text-sm text-[rgba(254,254,254,0.5)]">{activeDemo.description}</p>
                </div>
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(254,254,254,0.08)] sm:flex">
                  <Play className="h-4 w-4 text-[#fefefe]" />
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEMOS.map((demo, i) => (
            <FadeIn key={demo.id} delay={0.1 * i}>
              <button
                onClick={() => setActiveId(demo.id)}
                data-magnetic
                className={cn(
                  "w-full rounded-xl border p-5 text-left transition-all duration-200 cursor-none",
                  activeId === demo.id
                    ? "border-[rgba(254,254,254,0.3)] bg-[rgba(254,254,254,0.08)]"
                    : "border-[rgba(254,254,254,0.08)] bg-transparent hover:border-[rgba(254,254,254,0.15)] hover:bg-[rgba(254,254,254,0.03)]"
                )}
              >
                <p className="text-xs font-medium text-[rgba(254,254,254,0.5)]">{demo.category}</p>
                <h4 className="mt-2 text-sm font-semibold text-white">{demo.title}</h4>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[rgba(254,254,254,0.4)]">
                  {demo.description}
                </p>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

