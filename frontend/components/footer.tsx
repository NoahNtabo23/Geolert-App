"use client"

import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border/30 mt-20">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        
        {/* Top section: Logo and main navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-2xl animate-gradient-flow bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              GeoLert
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Empowering communities through real-time awareness.
            </p>
          </div>
          
          {/* Main Footer Links */}
          <nav className="flex flex-wrap gap-6 md:gap-8">
            <Link href="/map" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Live Map
            </Link>
            <Link href="/partners" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Partners
            </Link>
            <Link href="#reports" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Recent Reports
            </Link>
          </nav>
        </div>

        {/* Divider line */}
        <div className="border-t border-border/30 pt-8">
          
          {/* Bottom bar: Copyright and legal links */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} GeoLert. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}