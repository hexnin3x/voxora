"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface IndustryData {
  title: string;
  description: string;
  imageUrl: string;
  benefits: string[];
}

const industries: IndustryData[] = [
  {
    title: "Dental Clinics",
    description: "Reduce front desk workload while capturing every new patient inquiry.",
    imageUrl: "/images/dental.webp",
    benefits: [
      "Reduce no-shows with SMS reminders",
      "Capture after-hours patients",
      "Free staff for in-office care"
    ]
  },
  {
    title: "Cosmetic Clinics",
    description: "Handle high-value consultation requests with a premium, professional experience.",
    imageUrl: "/images/cosmetic.webp",
    benefits: [
      "Qualify treatment interest",
      "Book consultation slots",
      "Maintain brand consistency"
    ]
  },
  {
    title: "Law Firms",
    description: "Screen intake calls and collect case details before attorney follow-up.",
    imageUrl: "/images/legal.webp",
    benefits: [
      "Pre-qualify potential clients",
      "Capture case details accurately",
      "Schedule consultations"
    ]
  },
  {
    title: "Real Estate",
    description: "Qualify buyers and sellers and schedule property viewings around the clock.",
    imageUrl: "/images/realestate.webp",
    benefits: [
      "Capture lead intent instantly",
      "Schedule property viewings",
      "Never miss a hot lead"
    ]
  },
  {
    title: "Home Services",
    description: "Book service calls and dispatch technicians without tying up your team.",
    imageUrl: "/images/homeservices.webp",
    benefits: [
      "Book service appointments",
      "Capture job details",
      "Route emergency calls"
    ]
  }
];

export function Industries() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload all industry images on mount to ensure instantaneous tab transitions
  useEffect(() => {
    industries.forEach((industry) => {
      const img = new window.Image();
      img.src = industry.imageUrl;
    });
  }, []);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % industries.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + industries.length) % industries.length
    );

  const currentIndustry = industries[currentIndex];

  return (
    <section id="industries" className="border-y border-border bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="Industries"
            title="Built for Businesses That"
            highlight="Depend on Calls"
            description="Tailored AI agents for the industries where every call counts."
          />
        </FadeIn>

        <div className="w-full max-w-5xl mx-auto px-4 mt-16">
          {/* Desktop layout */}
          <div className="hidden md:flex relative items-center">
            {/* Avatar / Visual */}
            <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-muted flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndustry.imageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src={currentIndustry.imageUrl}
                    alt={currentIndustry.title}
                    width={470}
                    height={470}
                    className="w-full h-full object-cover"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card */}
            <div className="bg-card rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1 border border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndustry.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {currentIndustry.title}
                    </h3>
                  </div>

                  <p className="text-foreground text-base leading-relaxed mb-6">
                    {currentIndustry.description}
                  </p>

                  <ul className="space-y-3 mb-4">
                    {currentIndustry.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="md:hidden max-w-sm mx-auto text-center bg-transparent">
            {/* Avatar / Visual */}
            <div className="w-full aspect-square bg-muted rounded-3xl overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndustry.imageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src={currentIndustry.imageUrl}
                    alt={currentIndustry.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Card content */}
            <div className="px-4 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndustry.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                    {currentIndustry.title}
                  </h3>
                  
                  <p className="text-foreground text-sm leading-relaxed mb-6 text-center">
                    {currentIndustry.description}
                  </p>
                  
                  <ul className="space-y-3 mb-4">
                    {currentIndustry.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex justify-center items-center gap-6 mt-8">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              aria-label="Previous industry"
              data-magnetic
              className="w-12 h-12 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors cursor-none"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {industries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  data-magnetic
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors cursor-none",
                    index === currentIndex
                      ? "bg-foreground"
                      : "bg-muted"
                  )}
                  aria-label={`Go to industry ${index + 1}`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={handleNext}
              aria-label="Next industry"
              data-magnetic
              className="w-12 h-12 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors cursor-none"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
