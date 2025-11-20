"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import SafetyTipsSection from "@/components/safety-tips-section"
import ReportForm from "@/components/report-form"
import IncidentFeed from "@/components/incident-feed"
import MiniMap from "@/components/mini-map"
import ChatBot from "@/components/chatbot"
import Footer from "@/components/footer"
import { HeadphonesIcon } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"


export default function Home() {
  const [reports, setReports] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  console.log("API URL =>", process.env.NEXT_PUBLIC_API_BASE_URL);


 const fetchReports = async () => {
  try {
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/disasters/reports`);

    const data = await res.json();

    // Convert backend fields → frontend structure
    const formatted = data.map((d: any) => ({
      id: d.id,
      type: d.disasterType || "unknown",     
      location: d.location || "Unknown",
      severity: d.severity || "low",
      timestamp: d.timestamp
        ? new Date(d.timestamp).toLocaleString()
        : "Unknown time",
      description: d.description || "",
      lat: d.lat || null,
      lng: d.lng || null
}));


    // Newest reports to appear first
    setReports(formatted.reverse());
  } catch (err) {
    console.error("Failed to load any reports:", err);
  }
};

 useEffect(() => {
  const isDark = localStorage.getItem("darkMode") === "true";
  setDarkMode(isDark);
  if (isDark) document.documentElement.classList.add("dark");

  fetchReports();
}, []);


  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleReportSubmit = async () => {
  setShowForm(false);
  await fetchReports(); // Refresh reports after new submission dynamically
};


  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <HeroSection onReportClick={() => setShowForm(true)} />

      <FeaturesSection />
      <SafetyTipsSection />

      {/* --- MAIN SECTION (2-COLUMN) --- */}
      <main className="container mx-auto px-4 py-24 max-w-7xl" id="reports">
        <div className="mb-16 animate-slide-in-up text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Community Dashboard</h2>
          <p className="text-lg text-muted-foreground">Live incident feed and map overview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Incident Feed */}
          <div className="lg:col-span-3 animate-slide-in-up animate-stagger-1">
            <IncidentFeed reports={reports} />
          </div>

          {/* Right Column: Mini-Map */}
          <div className="lg:col-span-2 animate-slide-in-up animate-stagger-2">
            <MiniMap reports={reports} />
          </div>

        </div>
      </main>
  

      {/* --- CHAT BUTTON --- */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-br from-primary to-accent text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 hover:scale-110 active:scale-95 animate-pulse-glow"
        aria-label="Open chat assistant"
        title="Ask GeoHelp"
      >
        <HeadphonesIcon className="w-6 h-6" />
      </button>
    

      {/* Modals */}
      {showForm && <ReportForm onSubmit={handleReportSubmit} onClose={() => setShowForm(false)} />}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

      <Footer />
    </div>
  )
}