"use client"

import { useEffect, useRef } from "react"

interface MapVisualizationProps {
  reports: any[]
}

export default function MapVisualization({ reports }: MapVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--border").trim()
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    const heatmapCanvas = document.createElement("canvas")
    heatmapCanvas.width = canvas.width
    heatmapCanvas.height = canvas.height
    const heatCtx = heatmapCanvas.getContext("2d")
    if (!heatCtx) return

    reports.forEach((report) => {
      const x = (report.lng - 36) * 100 + 50
      const y = (report.lat + 1.5) * 100 + 50

      if (x > 0 && x < canvas.width && y > 0 && y < canvas.height) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30)
        gradient.addColorStop(0, "rgba(255, 109, 0, 0.4)")
        gradient.addColorStop(1, "rgba(255, 109, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(x - 30, y - 30, 60, 60)

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--primary-foreground").trim()
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [reports])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg animate-scale-in">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
          </svg>
          Live Incident Map
        </h2>
      </div>

      <canvas ref={canvasRef} className="w-full h-96 bg-background" />

      <div className="p-4 border-t border-border bg-card/50">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-muted-foreground">Active Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
