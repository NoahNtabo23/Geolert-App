"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SunIcon, MoonIcon } from "lucide-react"

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure component only renders on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    // Sticky header with premium glass effect
    <header className="sticky top-0 z-50 glass-effect-strong border-b border-white/10 backdrop-blur-md animate-slide-in-down">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo with animated gradient text */}
          <Link href="/" className="group cursor-pointer">
            <h1 className="text-2xl font-bold animate-gradient-flow bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              GeoLert
            </h1>
          </Link>

          {/* Navigation and Controls */}
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/map"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 px-3 py-2"
            >
              Live Map
            </Link>

            <Link
              href="/partners"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 px-3 py-2"
            >
              Partners Portal
            </Link>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-lg glass-effect hover:glass-effect-strong transition-all duration-300"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-accent" />
              ) : (
                <MoonIcon className="w-5 h-5 text-primary" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}