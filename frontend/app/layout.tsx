import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster"


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoLert - Community Disaster Reporting",
  description: "Real-time crowdsourced disaster reporting and mapping platform for Kenya",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load Google Maps + Places API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places,visualization`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`font-sans antialiased`}>
        
            {children}
          <Analytics />
          <Toaster />
        
      </body>
    </html>
  );
}
