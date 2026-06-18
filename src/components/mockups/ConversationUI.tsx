"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Phone, PhoneIncoming } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
  { role: "ai", text: "Good afternoon, thank you for calling Smile Dental. How can I help you today?" },
  { role: "caller", text: "Hi, I'd like to book a cleaning appointment for next Tuesday." },
  { role: "ai", text: "I'd be happy to help. I have 2:30 PM or 4:00 PM available on Tuesday. Which works better?" },
  { role: "caller", text: "2:30 PM works great." },
  { role: "ai", text: "Perfect. I've booked your cleaning for Tuesday at 2:30 PM. You'll receive a confirmation text shortly." },
];

export function ConversationUI() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 2000);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(254,254,254,0.08)] bg-[#0e0e00] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[rgba(254,254,254,0.08)] px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(254,254,254,0.08)]">
          <PhoneIncoming className="h-5 w-5 text-[#fefefe]" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Incoming Call</p>
          <p className="text-xs text-[rgba(254,254,254,0.5)]">New Patient — (555) 234-8901</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#fefefe]" />
          <span className="text-xs text-white">Live</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <AnimatePresence>
          {MESSAGES.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex ${msg.role === "caller" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "rounded-bl-md bg-[rgba(254,254,254,0.06)] border border-[rgba(254,254,254,0.08)] text-white"
                    : "rounded-br-md bg-[rgba(254,254,254,0.12)] border border-[rgba(254,254,254,0.12)] text-white"
                }`}
              >
                {msg.role === "ai" && (
                  <span className="mb-1 block text-xs font-medium text-[rgba(254,254,254,0.5)]">AI Agent</span>
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 border-t border-[rgba(254,254,254,0.08)] px-5 py-3">
        <Phone className="h-4 w-4 text-[rgba(254,254,254,0.5)]" />
        <span className="text-xs text-[rgba(254,254,254,0.5)]">Call duration: 1:42</span>
      </div>
    </div>
  );
}

