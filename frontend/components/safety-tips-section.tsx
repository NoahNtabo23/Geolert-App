"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ShieldAlertIcon, ZapIcon, CloudRainIcon, FlameIcon, SunIcon } from "lucide-react"

const safetyTips = [
  {
    value: "fire",
    icon: <FlameIcon className="w-5 h-5 text-red-500" />,
    title: "Fire Safety",
    content:
      "Evacuate immediately. Stay low to the ground to avoid smoke. Do not open hot doors. Once you are safe, call emergency services.",
  },
  {
    value: "flood",
    icon: <CloudRainIcon className="w-5 h-5 text-blue-500" />,
    title: "Flood Safety",
    content:
      "Move to higher ground immediately. Do not walk, swim, or drive through floodwaters. Just six inches of moving water can knock you down.",
  },
  {
    value: "power-outage",
    icon: <ZapIcon className="w-5 h-5 text-yellow-500" />,
    title: "Power Outage",
    content:
      "Use flashlights instead of candles. Keep freezers and refrigerators closed. Disconnect appliances to avoid damage from electrical surges.",
  },
  {
    value: "drought",
    icon: <SunIcon className="w-5 h-5 text-orange-500" />,
    title: "Drought Tips",
    content:
      "Conserve water wherever possible. Fix leaky faucets and pipes. Use water-wise landscaping and follow local water use restrictions.",
  },
]

export default function SafetyTipsSection() {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <ShieldAlertIcon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Essential Safety Tips</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Know what to do when disaster strikes.
          </p>
        </div>

        {/* Accordion */}
        <div className="animate-slide-up-fade animate-stagger-1">
          <Accordion type="single" collapsible className="w-full">
            {safetyTips.map((tip) => (
              <AccordionItem
                key={tip.value}
                value={tip.value}
                className="glass-effect rounded-2xl px-6 mb-3 border-b-0"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    {tip.icon}
                    <span>{tip.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground pt-2">
                  {tip.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}