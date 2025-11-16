"use client"

import { cn } from "@/lib/utils"

// Base styles for all orbs
const orbBaseClasses = "absolute rounded-full filter blur-xl"

// Orbs with strong opacity and multiple animations
const orbs = [
  {
    class: "bg-primary/50 w-56 h-56",
    animation: "animate-siri-pulse",
    style: { animationDelay: "0s", animationDuration: "8s" },
  },
  {
    class: "bg-accent/50 w-48 h-48",
    animation: "animate-siri-float",
    style: { animationDelay: "2s", animationDuration: "10s" },
  },
  {
    class: "bg-blue-500/40 w-40 h-40",
    animation: "animate-siri-pulse",
    style: { animationDelay: "1s", animationDuration: "7s" },
  },
  {
    class: "bg-primary/30 w-52 h-52",
    animation: "animate-siri-float",
    style: { animationDelay: "3s", animationDuration: "12s" },
  },
]

export default function SiriAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Custom keyframes */}
      <style>
        {`
          @keyframes siri-pulse {
            0%, 100% {
              transform: scale(0.85);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
          @keyframes siri-float {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            25% {
              transform: translate(20px, 10px) scale(1.05);
            }
            50% {
              transform: translate(-15px, 5px) scale(0.95);
            }
            75% {
              transform: translate(10px, -15px) scale(1.05);
            }
          }
          .animate-siri-pulse {
            animation: siri-pulse infinite ease-in-out;
          }
          .animate-siri-float {
            animation: siri-float infinite ease-in-out;
          }
        `}
      </style>

      {/* Render the orbs */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className={cn(orbBaseClasses, orb.class, orb.animation)}
            style={orb.style}
          />
        ))}
      </div>
    </div>
  )
}