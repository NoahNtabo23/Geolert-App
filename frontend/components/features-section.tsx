"use client"

import { MapIcon, BellIcon, MegaphoneIcon } from "lucide-react"



const features = [
  {
    icon: <MegaphoneIcon className="w-8 h-8 text-primary" />,
    title: "Report Incidents Fast",
    description: "Quickly report disasters like fires, floods, or power outages using our simple, multi-step form.",
  },
  {
    icon: <MapIcon className="w-8 h-8 text-primary" />,
    title: "View a Live Map",
    description: "See a real-time heatmap of all reported incidents in your area to understand what's happening around you.",
  },
  {
    icon: <BellIcon className="w-8 h-8 text-primary" />,
    title: "Stay Informed",
    description: "Get updates from our partners and see verified reports to stay safe and make informed decisions.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How GeoLert Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple 3-step process for community-driven safety.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-effect-strong rounded-3xl p-8 text-center shadow-lg hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}