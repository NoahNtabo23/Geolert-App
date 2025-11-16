"use client"

import { MapPin, BarChart2, Users } from "lucide-react"

interface HeroSectionProps {
  onReportClick: () => void
}

export default function HeroSection({ onReportClick }: HeroSectionProps) {
  return (
    // Section 1: Full-Screen Hero
    <section className="relative flex items-center justify-center min-h-screen py-24 md:py-40 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-40 dark:opacity-20" />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent/20 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-40 dark:opacity-20"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-primary/10 to-transparent rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-30 dark:opacity-10"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center flex flex-col items-center">
        
        {/* Main Headline */}
        <h1 className="text-5xl md:text-8xl font-bold mb-8 text-balance leading-tight animate-slide-up-fade">
          Community-Powered
          <br />
          <span className="animate-gradient-flow bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Incident Reporting
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-2xl text-muted-foreground mb-12 text-balance max-w-3xl mx-auto leading-relaxed animate-slide-up-fade animate-stagger-1">
          Report power outages, floods, and fires in real-time. See what's
          happening on a live map, powered by your community.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up-fade animate-stagger-2">
          <button
            onClick={onReportClick}
            className="px-8 py-4 bg-linear-to-r from-primary to-accent hover:shadow-2xl text-primary-foreground font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Report an Incident
          </button>
          <a
            href="/map"
            className="px-8 py-4 glass-effect hover:glass-effect-strong font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            View Live Map
          </a>
        </div>

        {/* "Glass" App Preview Card */}
        <div
          className="w-full max-w-4xl glass-effect-strong rounded-3xl shadow-2xl p-6 border border-white/10 animate-slide-up-fade animate-stagger-3"
        >
          {/* Mock App Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm font-medium text-foreground/80">
              GeoLert Live Dashboard
            </div>
            <div className="w-12"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-sm text-muted-foreground">Active Reports</p>
                </div>
              </div>
            </div>
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-accent" />
                <div className="text-left">
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Locations Covered</p>
                </div>
              </div>
            </div>
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="text-2xl font-bold">12.5K</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}