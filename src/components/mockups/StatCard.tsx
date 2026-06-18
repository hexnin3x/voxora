"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "rounded-xl border border-[rgba(254,254,254,0.08)] bg-[rgba(26,26,13,0.8)] p-4 shadow-xl backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(254,254,254,0.08)]">
          <Icon className="h-4 w-4 text-[#fefefe]" />
        </div>
        <span className="text-xs text-[rgba(254,254,254,0.5)]">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </motion.div>
  );
}

