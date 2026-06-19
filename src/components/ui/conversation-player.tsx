"use client";

import React, { useRef, useState, useEffect } from "react";
import { Pause, Play, Phone, Scale, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  start: number;
  end: number;
  speaker: "AI" | "Caller";
  speakerName?: string;
  text: string;
}

interface ConversationPlayerProps {
  audioSrc: string;
  transcript: Message[];
  activeDemoId?: string;
  onSelectDemoId?: (id: string) => void;
}

export function ConversationPlayer({
  audioSrc,
  transcript,
  activeDemoId = "dental",
  onSelectDemoId,
}: ConversationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(true);
  const [time, setTime] = useState(0);

  // Responsive layout check for orbit radius
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous 60fps Rotation & Time ticking for wave calculations
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      
      // Rotate slowly (e.g. 12 degrees per second)
      setRotationAngle((prev) => (prev + delta * 12) % 360);
      setTime((prev) => prev + delta);
      
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Handle Play/Pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((err) => {
          console.warn("Audio play failed or file missing:", err);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Orbital Nodes Configuration (Dental, Cosmetic, Legal, Real Estate)
  const demoNodes = [
    { id: "dental", title: "Dental Clinic", icon: Phone },
    { id: "cosmetic", title: "Cosmetic Clinic", icon: Sparkles },
    { id: "legal", title: "Law Firm", icon: Scale },
    { id: "realestate", title: "Real Estate", icon: Home },
  ];

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    
    // Increased spacing (Base radius: 130px on mobile, 210px on desktop)
    const baseRadius = isMobile ? 130 : 210; 
    
    // Subtler movements (Slowed down ripple speed and halved amplitudes)
    const waveSpeed = isPlaying ? 1.8 : 0.8;
    const waveAmplitude = isPlaying ? (isMobile ? 6 : 10) : (isMobile ? 3 : 5);
    
    // Smooth wave offset (sine wave ripple based on angle & time)
    const waveOffset = Math.sin((angle * Math.PI) / 90 + time * waveSpeed) * waveAmplitude;
    const radius = baseRadius + waveOffset;

    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.3 + 0.7 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center bg-transparent select-none overflow-visible min-h-[360px] md:min-h-[500px]">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={handleAudioEnded}
        onError={() => setIsPlaying(false)}
      />

      {/* Responsive Orbit Area (Increased width/height to fit larger spacing) */}
      <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center overflow-visible z-10">
        
        {/* Orbit Path Circles */}
        <div className="absolute w-[290px] h-[290px] md:w-[440px] md:h-[440px] rounded-full border border-white/[0.03] flex items-center justify-center pointer-events-none">
          <div className="absolute w-[260px] h-[260px] md:w-[400px] md:h-[400px] rounded-full border border-white/[0.02] pointer-events-none" />
        </div>

        {/* AI Center Node (Retell-style pulsing morphing 3D Glass sphere) */}
        <button
          onClick={togglePlay}
          className="group absolute w-24 h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center transition-all duration-300 z-50 cursor-none retell-orb border-none outline-none relative"
          type="button"
        >
          {/* Inner hover play/pause icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10 rounded-full">
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current md:w-8 md:h-8" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1 md:w-8 md:h-8" />
            )}
          </div>
        </button>

        {/* Orbiting Demo Agent Nodes */}
        {demoNodes.map((node, index) => {
          const position = calculateNodePosition(index, demoNodes.length);
          const isActive = activeDemoId === node.id;
          const isHovered = hoveredNodeId === node.id;
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className="absolute transition-opacity duration-300"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isActive ? 200 : position.zIndex,
                opacity: isActive || isHovered ? 1 : position.opacity,
              }}
            >
              {/* Glowing halo behind active node (Monochrome white/gray) */}
              {isActive && (
                <div className="absolute -inset-2.5 rounded-full bg-white/5 border border-white/10 animate-pulse pointer-events-none" />
              )}

              {/* Node Button (Larger sizing, white active, dark inactive) */}
              <button
                onClick={() => onSelectDemoId?.(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={cn(
                  "w-13 h-13 md:w-16 md:h-16 rounded-full flex items-center justify-center border transition-all duration-300 cursor-none relative",
                  isActive
                    ? "bg-white border-white text-black shadow-lg shadow-white/15 scale-115"
                    : "bg-[#141414] border-white/10 text-white/50 hover:border-white hover:text-white hover:scale-105"
                )}
                title={node.title}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Label floating underneath node (Monochrome white/gray) */}
              <div
                className={cn(
                  "absolute top-14 md:top-18 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors pointer-events-none",
                  isActive ? "text-white" : "text-white/40"
                )}
              >
                {node.title.split(" ")[0]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
