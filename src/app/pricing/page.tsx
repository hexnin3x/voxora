"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";

// Dynamically import MeshGradient with SSR disabled to prevent server-side canvas/WebGL hydration issues
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.MeshGradient),
  { ssr: false }
);

export default function PricingPage() {
  const [speed] = useState(0.8);

  return (
    <MagneticCursor magneticFactor={0.3} cursorSize={28} blendMode="exclusion">
      <div className="min-h-screen w-full max-w-[100vw] bg-black relative overflow-clip flex flex-col justify-between">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 z-0 opacity-60 pointer-events-none overflow-hidden">
          <MeshGradient
            className="w-full h-full absolute inset-0"
            colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
            speed={speed * 0.5}
          />
        </div>

        {/* Ambient lighting overlay effects */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-clip">
          <div className="absolute top-1/4 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-white/[0.02] rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-52 sm:w-80 h-52 sm:h-80 bg-white/[0.01] rounded-full blur-3xl" />
        </div>

        <Navbar />

        {/* Pricing Content */}
        <main className="relative z-10 pt-24 pb-16 w-full max-w-[100vw] overflow-clip flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-7xl">
            <Pricing />
          </div>
        </main>

        <Footer />
      </div>
    </MagneticCursor>
  );
}
