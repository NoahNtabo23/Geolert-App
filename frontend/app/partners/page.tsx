"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PartnerMap from "@/components/partner-map" 
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Flame, CloudRain, Sun, MapPin, CheckIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"//sweet alert popup for frontend


// Icon logic
const icons: Record<string, React.ReactNode> = {
  "power-outage": <Zap className="w-4 h-4" />,
  fire: <Flame className="w-4 h-4" />,
  flood: <CloudRain className="w-4 h-4" />,
  drought: <Sun className="w-4 h-4" />,
}
const getIncidentIcon = (type: string) => icons[type.toLowerCase().replace(" ", "-")] || <MapPin className="w-4 h-4" />

// Color logic
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-500/20 text-amber-600 dark:text-amber-400"
    case "in-progress":
      return "bg-blue-500/20 text-blue-600 dark:text-blue-400"
    case "resolved":
      return "bg-green-500/20 text-green-600 dark:text-green-400"
    default:
      return "bg-gray-500/20"
  }
}

export default function PartnersPortal() {
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [statusUpdate, setStatusUpdate] = useState("")
  const { toast } = useToast()


  const [incidents, setIncidents] = useState([
    { id: 1, type: "Power Outage", location: "Nairobi, CBD", severity: "high", status: "pending", reports: 15, timestamp: "2 hours ago", lat: -1.28, lng: 36.82, description: "Major outage reported near City Hall." },
    { id: 2, type: "Flood", location: "Karen, Nairobi", severity: "critical", status: "in-progress", reports: 8, timestamp: "30 minutes ago", lat: -1.32, lng: 36.70, description: "Main road flooded, several cars stuck." },
    { id: 3, type: "Fire", location: "Westlands", severity: "medium", status: "resolved", reports: 12, timestamp: "4 hours ago", lat: -1.26, lng: 36.80, description: "Small fire at a commercial building, now contained." },
  ])

  useEffect(() => {
  const isDark = localStorage.getItem("darkMode") === "true";
  setDarkMode(isDark);
  if (isDark) document.documentElement.classList.add("dark");

  // if token present, auto-login
  const t = localStorage.getItem("partnerToken");
  if (t) {
    setIsLoggedIn(true);
    loadDashboardData(t);
  }
}, []);

//fetch wrapper for getting access token for login
async function apiFetch(path: string, opts: any = {}) {
  const token = localStorage.getItem("partnerToken");
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, { ...opts, headers });
  if (res.status === 401) {
    // token invalid → logout
    setIsLoggedIn(false);
    localStorage.removeItem("partnerToken");
    throw new Error("Unauthorized");
  }
  return res;
}



async function loadDashboardData(token?: string) {
  try {
    const t = token || localStorage.getItem("partnerToken");
    // fetch incidents + stats in parallel
    const [incRes, statsRes] = await Promise.all([
      apiFetch("/partners/incidents"),
      apiFetch("/partners/stats"),
    ]);
    const incJson = await incRes.json();
    const statsJson = await statsRes.json();

    // normalize incidents to expected UI format
    const normalized = incJson.map((i: any) => ({
      id: i.id,
      type: i.type || i.disasterType || "unknown",
      location: i.location,
      severity: i.severity || "low",
      status: i.status || "pending",
      reports: i.reports || 0,
      timestamp: i.timestamp ? new Date(i.timestamp).toLocaleString() : "Unknown",
      lat: i.lat ?? null,
      lng: i.lng ?? null,
      description: i.description || ""
    }));

    setIncidents(normalized);
    // pick first as default
    if (normalized.length > 0) {
      setSelectedIncident(normalized[0]);
      setStatusUpdate(normalized[0].status);
    }
    
  } catch (err) {
    console.error("loadDashboardData error", err);
  }
}





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


// Login handler with jwt token storage brcught from backend
  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!loginData.email || !loginData.password) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/partners/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginData.email, password: loginData.password }),
    });
    if (!res.ok) {
        const t = await res.text();
        // Use toast for error display
        toast({
          title: "Login Failed",
          description: t || "Invalid email or password",
          variant: "destructive",
        });

        return;
      }

    const data = await res.json();
    localStorage.setItem("partnerToken", data.token);
    setIsLoggedIn(true);
    await loadDashboardData(data.token);
      } catch (err) {
      console.error("Login error", err);

      toast({
        title: "Network Error",
        description: "Could not connect to server. Please try again.",
        variant: "destructive",
      });
    }


};


  const handleSelectIncident = (incident: any) => {
    setSelectedIncident(incident)
    setStatusUpdate(incident.status) // Set the status for the dropdown
  }


  //Using the patch endpoint from backend to dynamically update incident status
 const handleStatusUpdate = async () => {
  if (!selectedIncident) return;
  if (statusUpdate === selectedIncident.status) return;

  try {
    
    const old = incidents;
    setIncidents(incidents.map(i => i.id === selectedIncident.id ? { ...i, status: statusUpdate } : i));
    setSelectedIncident({ ...selectedIncident, status: statusUpdate });

    const res = await apiFetch(`/partners/incidents/${selectedIncident.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusUpdate }),
    });

    if (!res.ok) {
      // rollback if failed
      setIncidents(old);
      setSelectedIncident(old.find((i:any) => i.id === selectedIncident.id));
      const txt = await res.text();
      alert("Failed to update: " + txt);
      return;
    }
    // success — optionally refetch stats/incidents
    await loadDashboardData();
  } catch (err) {
    console.error("status update failed", err);
    alert("Failed to update status");
  }
};



  // Stats calculation on dashboard
  const totalReports = incidents.length
  const pendingReports = incidents.filter((i) => i.status === "pending").length
  const inProgressReports = incidents.filter((i) => i.status === "in-progress").length
  const resolvedReports = incidents.filter((i) => i.status === "resolved").length

  const stats = [
    { label: "Total Reports", value: totalReports },
    { label: "Pending", value: pendingReports },
    { label: "In Progress", value: inProgressReports },
    { label: "Resolved", value: resolvedReports },
  ]

  // --- Login Page ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto px-4 py-16 max-w-md">
          <div className="glass-effect-strong rounded-3xl shadow-2xl overflow-hidden p-8 animate-scale-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold animate-gradient-flow bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                Partners Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Login to manage incident reports and provide status updates.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 animate-slide-up-fade">
              <div>
                <label className="block text-sm font-semibold mb-2">Organization Email</label>
                <input
                  type="email"
                  placeholder="your@organization.org"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-accent text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Login to Portal
              </button>
              <p className="text-xs text-muted-foreground text-center pt-4">
                Demo: Use any email and password to login
              </p>
            </form>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link href="/" className="text-sm text-primary hover:text-accent transition-colors text-center block">
                ← Back to GeoLert
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-up-fade">
          <div>
            <h1 className="text-3xl font-bold mb-2">Partner Dashboard</h1>
            <p className="text-muted-foreground">Welcome dear partner...</p>
          </div>
         <Button
              onClick={() => {
                localStorage.removeItem("partnerToken");
                setIsLoggedIn(false);
                setIncidents([]);
              }}
              variant="outline"
              className="glass-effect"
        >
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card
              key={stat.label}
              className={`glass-effect-strong rounded-2xl animate-slide-up-fade`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <CardHeader className="p-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-4xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Layout (Map + List + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Incident List & Details */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-[700px]">
            
            {/* Incident List */}
            <Card className="glass-effect-strong rounded-3xl flex-1 flex flex-col overflow-hidden animate-scale-in">
              <CardHeader className="p-5 border-b border-white/10">
                <CardTitle>Active Incidents</CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex-1 overflow-y-auto space-y-2">
                {incidents.map((incident) => (
                  <button
                    key={incident.id}
                    onClick={() => handleSelectIncident(incident)}
                    className={`w-full p-3 rounded-xl transition-all duration-300 text-left ${
                      selectedIncident?.id === incident.id
                        ? "glass-effect-strong border-primary/50 bg-primary/10"
                        : "glass-effect hover:glass-effect-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getIncidentIcon(incident.type)}
                        <span className="font-semibold text-sm capitalize">{incident.type.replace("-", " ")}</span>
                      </div>
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{incident.location}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Selected Incident Details & Update */}
            {selectedIncident && (
              <Card className="glass-effect-strong rounded-3xl animate-scale-in">
                <CardHeader className="p-5">
                  <CardTitle>Update Status</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <div>
                    <h4 className="font-semibold">{selectedIncident.location}</h4>
                    <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Set Status</label>
                     <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                        <SelectTrigger className="w-full glass-effect border-white/20">
                            <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent className="glass-effect-strong border-white/20">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <Button 
                    onClick={handleStatusUpdate} 
                    className="w-full bg-linear-to-r from-primary to-accent"
                    disabled={statusUpdate === selectedIncident.status}
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Update Incident
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Column 2: Map */}
          <div className="lg:col-span-2 h-[700px] animate-scale-in animate-stagger-1">
            <PartnerMap 
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelectIncident={handleSelectIncident}
            />
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  )
}