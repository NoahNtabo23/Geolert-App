"use client"
import { useState, useEffect, useRef } from "react"
import { Zap, Flame, CloudRain, Sun, MapPin, Check } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportFormProps {
  onSubmit: (report: any) => void
  onClose: () => void
}

interface FormData {
  type: string
  description: string
  severity: string
  location: string
  lat: number | null
  lng: number | null
}

export default function ReportForm({ onSubmit, onClose }: ReportFormProps) {
  const [step, setStep] = useState<"type" | "details" | "summary" | "success">("type")
  const [formData, setFormData] = useState<FormData>({
    type: "",
    description: "",
    severity: "medium",
    location: "",
    lat: null,
    lng: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // use `any` for autocomplete to avoid TypeScript build errors if google types are missing
    let autocomplete: any = null

    const initAutocomplete = () => {
      const g = (window as any).google
      if (g && g.maps && g.maps.places && inputRef.current) {
        autocomplete = new g.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode"],
          componentRestrictions: { country: "ke" },
        })

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()
          if (!place) return

          const formattedAddress = place.formatted_address || place.name || ""
          const lat = place.geometry?.location?.lat?.() ?? null
          const lng = place.geometry?.location?.lng?.() ?? null

          setFormData((prev) => ({
            ...prev,
            location: formattedAddress,
            lat,
            lng,
          }))
        })
      } else {
        // Try again if script hasn't loaded yet
        setTimeout(initAutocomplete, 500)
      }
    }

    initAutocomplete()

    // Cleanup listener on unmount
    return () => {
      const g = (window as any).google
      if (autocomplete && g && g.maps && g.maps.event && typeof g.maps.event.clearInstanceListeners === "function") {
        g.maps.event.clearInstanceListeners(autocomplete)
      }
    }
  }, [])

  const incidentTypes = [
    {
      value: "power-outage",
      label: "Power Outage",
      icon: <Zap className="w-6 h-6" />,
      color: "text-yellow-400 bg-yellow-400/10",
    },
    {
      value: "fire",
      label: "Fire",
      icon: <Flame className="w-6 h-6" />,
      color: "text-red-500 bg-red-500/10",
    },
    {
      value: "flood",
      label: "Flood",
      icon: <CloudRain className="w-6 h-6" />,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      value: "drought",
      label: "Drought",
      icon: <Sun className="w-6 h-6" />,
      color: "text-orange-500 bg-orange-500/10",
    },
  ]

  const handleTypeSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleNextStep = () => {
    if (step === "type" && formData.type) {
      setStep("details")
    } else if (step === "details") {
      if (!formData.location.trim()) {
        alert("Please enter a location")
        return
      }
      setStep("summary")
    }
  }

  const handlePrevStep = () => {
    if (step === "details") {
      setStep("type")
    } else if (step === "summary") {
      setStep("details")
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const payload = {
        disasterType: formData.type,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        outageTime: new Date().toISOString(),
        lat: formData.lat,
        lng: formData.lng,
      };


      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/disasters/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        alert(await res.text())
        return
      }

      const newReport = await res.json()

      // Return the created report back to parent component for loading on recent feed page
      onSubmit(newReport)

      setStep("success")
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackHome = () => {
    setStep("type")
    setFormData({
      type: "",
      description: "",
      severity: "medium",
      location: "",
      lat: null,
      lng: null,
    })

    onClose()
  }

  const getSelectedTypeLabel = () => {
    return incidentTypes.find((t) => t.value === formData.type)?.label || "Report"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md">
        <div className="glass-effect-strong rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            {step !== "success" && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 hover:bg-white/20 rounded-xl transition-all duration-300"
                aria-label="Close form"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-foreground">
              {step === "type" && "Select Incident Type"}
              {step === "details" && `Report: ${getSelectedTypeLabel()}`}
              {step === "summary" && "Review Your Report"}
              {step === "success" && "Report Submitted!"}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Incident Type Selection */}
            {step === "type" && (
              <div className="space-y-3 animate-slide-up-fade">
                <p className="text-sm text-muted-foreground mb-4">What's happening?</p>
                <div className="space-y-3">
                  {incidentTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleTypeSelect(type.value)}
                      className={`glass-effect w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between
                        ${
                          formData.type === type.value
                            ? "border-primary ring-2 ring-primary/50"
                            : "border-white/20 hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                          {type.icon}
                        </div>
                        <span className="text-base font-semibold text-foreground">{type.label}</span>
                      </div>
                      {formData.type === type.value && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === "details" && (
              <div className="space-y-5 animate-slide-up-fade">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Location</label>
                  <div className="relative">
                    <input
                      ref={inputRef}
                      id="location-input"
                      type="text"
                      placeholder="Search for a location..."
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    />

                    <MapPin className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Description</label>
                  <textarea
                    placeholder="Add more details (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none h-24 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* --- DROPDOWN --- */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Severity Level</label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-primary transition-all duration-300 text-foreground text-left font-normal">
                      <SelectValue placeholder="Select severity..." />
                    </SelectTrigger>
                    <SelectContent className="glass-effect-strong border-white/20 text-foreground">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Summary Review */}
            {step === "summary" && (
              <div className="space-y-4 animate-slide-up-fade">
                <div className="glass-effect p-5 rounded-xl space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Incident Type</p>
                    <p className="font-semibold text-foreground">
                      {incidentTypes.find((t) => t.value === formData.type)?.label}
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{formData.location}</p>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <p className="font-semibold text-foreground capitalize">{formData.severity}</p>
                  </div>
                  {formData.description && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm text-foreground">{formData.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === "success" && (
              <div className="space-y-6 text-center animate-slide-up-fade">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Report Submitted!</h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you. Your report is now visible on the live map and our partners have been alerted.
                  </p>
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">Report ID</p>
                  <p className="font-mono text-sm font-semibold text-primary">#{Date.now().toString().slice(-8)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="px-6 py-5 border-t border-white/10">
            {step === "success" ? (
              <button
                onClick={handleBackHome}
                className="w-full px-4 py-3 rounded-xl bg-linear-to-r from-primary to-accent text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              >
                Done
              </button>
            ) : (
              <div className="flex gap-3">
                {step !== "type" && (
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/20 glass-effect text-foreground font-semibold transition-all duration-300 hover:bg-white/10"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === "summary" ? handleSubmit : handleNextStep}
                  disabled={(step === "type" && !formData.type) || isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-linear-to-r from-primary to-accent text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {step === "details"
                    ? "Review"
                    : step === "summary"
                      ? isSubmitting
                        ? "Submitting..."
                        : "Submit Report"
                      : "Next"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
