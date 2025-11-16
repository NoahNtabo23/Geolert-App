"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import LiveMap from "@/components/live-map" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" 
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group" 
import { MapIcon, LayersIcon, ZapIcon, FlameIcon, CloudRainIcon, SunIcon } from "lucide-react"


// Icons
const icons: Record<string, React.ReactElement<any, any>> = {
  "power-outage": <ZapIcon className="w-8 h-8" />,
  fire: <FlameIcon className="w-8 h-8" />,
  flood: <CloudRainIcon className="w-8 h-8" />,
  drought: <SunIcon className="w-8 h-8" />,
}

const getIncidentIcon = (type: string, size: string = "w-5 h-5") => {
  const icon = icons[type] || <MapIcon className={size} />
  return React.cloneElement(icon as React.ReactElement<any, any>, { className: size })
}

// Get color intensity
const getMarkerColor = (severity: string, reports: number) => {
  if (severity === "critical" || reports > 25) return "bg-red-500 text-red-50"
  if (severity === "high" || reports > 15) return "bg-orange-500 text-orange-50"
  if (severity === "medium" || reports > 8) return "bg-yellow-500 text-yellow-50"
  return "bg-blue-500 text-blue-50"
}



export default function LiveMapPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [mapView, setMapView] = useState("markers") // 'markers' or 'heatmap'
  const [incidents, setIncidents] = useState<any[]>([]);

  

  useEffect(() => {
  const isDark = localStorage.getItem("darkMode") === "true";
  setDarkMode(isDark);
  if (isDark) document.documentElement.classList.add("dark");

  // Fetch live incidents
  fetch("http://localhost:4000/disasters/reports")
    .then((res) => res.json())
    .then((data) => {
      const formatted = data.map((d: any) => ({
        id: d.id,
        type: d.type || d.disasterType || "unknown",
        location: d.location || "Unknown",
        severity: d.severity || "low",
        reports: d.reports || 1,
        description: d.description || "",
        lat: d.lat ?? null,
        lng: d.lng ?? null,
      }));

      setIncidents(formatted);
    })
    .catch((err) => console.error("Failed to load incidents:", err));
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up-fade">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Live Incident Map</h1>
              <p className="text-muted-foreground">Real-time disaster reporting across Kenya</p>
            </div>
            <div className="flex gap-4">
                {/* Map View Toggles */}
                <ToggleGroup
                    type="single"
                    value={mapView}
                    onValueChange={(value) => value && setMapView(value)}
                    className="glass-effect p-1 rounded-lg"
                >
                    <ToggleGroupItem value="markers" aria-label="Markers view" className="gap-2 px-3">
                        <MapIcon className="w-4 h-4" />
                        Markers
                    </ToggleGroupItem>
                    <ToggleGroupItem value="heatmap" aria-label="Heatmap view" className="gap-2 px-3">
                        <LayersIcon className="w-4 h-4" />
                        Heatmap
                    </ToggleGroupItem>
                </ToggleGroup>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl glass-effect hover:bg-white/20 transition-all duration-300 font-semibold"
                >
                    ← Back Home
                </Link>
            </div>
          </div>
        </div>

        {/* Map Container with Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Map */}
          <div className="lg:col-span-3 animate-scale-in">
            <LiveMap
              incidents={incidents}
              onSelectIncident={setSelectedIncident}
              showHeatmap={mapView === "heatmap"}
            />

          </div>

          {/* Incident Details Sidebar */}
          <div className="lg:col-span-1 animate-slide-in-right">
            <div className="glass-effect-strong rounded-3xl p-6 h-[600px] flex flex-col overflow-hidden">
              <h3 className="text-lg font-bold mb-4">Incidents ({incidents.length})</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {incidents.map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`w-full p-4 rounded-xl transition-all duration-300 text-left ${
                      selectedIncident?.id === incident.id
                        ? "glass-effect-strong border-primary/50 bg-primary/10"
                        : "glass-effect hover:glass-effect-strong"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className={`p-2 rounded-lg ${getMarkerColor(incident.severity, incident.reports)}`}>
                        {getIncidentIcon(incident.type, 'w-4 h-4')}
                      </div>
                      <span className="font-semibold text-sm capitalize">{incident.type.replace("-", " ")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{incident.location}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {incident.reports} reports
                      </span>
                      <span
                        className={`text-xs font-semibold capitalize px-2 py-1 rounded-full ${
                          incident.severity === "critical"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : incident.severity === "high"
                              ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                              : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {incident.severity}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Incident Details (Improved with Card) */}
        {selectedIncident && (
          <Card className="glass-effect-strong rounded-3xl p-4 animate-scale-in">
            <CardHeader>
              <button
                onClick={() => setSelectedIncident(null)}
                className="mb-4 text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                ← Close Details
              </button>
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-2xl ${getMarkerColor(selectedIncident.severity, selectedIncident.reports)}`}
                >
                  {getIncidentIcon(selectedIncident.type, 'w-8 h-8')}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold capitalize">{selectedIncident.type.replace("-", " ")}</CardTitle>
                  <p className="text-muted-foreground">{selectedIncident.location}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-effect rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Total Reports</p>
                      <p className="text-3xl font-bold text-primary">{selectedIncident.reports}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Severity</p>
                      <p className="text-xl font-bold capitalize">{selectedIncident.severity}</p>
                    </div>
                  </div>
                   {selectedIncident.description && (
                     <div className="glass-effect rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-base">{selectedIncident.description}</p>
                     </div>
                   )}
                </div>

                {/* Action Panel */}
                <div className="md:col-span-1">
                  <div className="glass-effect rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold">Quick Actions</h3>
                    <button className="w-full px-4 py-3 bg-linear-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                      View Full Report
                    </button>
                    <button className="w-full px-4 py-3 glass-effect rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
                      Notify Partners
                    </button>
                    <button className="w-full px-4 py-3 glass-effect rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}